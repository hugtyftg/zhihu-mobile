import React, { useEffect, useRef, useState } from 'react'
import NavBarAgain from '../components/NavBarAgain'
import { Button, Form, Input, Toast } from 'antd-mobile'
import './Login.less'
import ButtonAgain from '../components/ButtonAgain';
import api from '../api';
import _ from '../assets/utils';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserInfo, fetchUserInfo } from '../redux/baseSlice';

export default function Login(props) {
  let { navigate, searchParams } = props;
  
  /* 状态 */
  let [formIns] = Form.useForm(),  // 用Form内置方法获取表单实例
    // 发送验证码节流
    [disabled, setDisabled] = useState(false),
    [sendText, setSendText] = useState('发送验证码');
  
  /* reduxjs/toolkit 组件不能直接和Provider中的store交互，借助下面两个Hook实现redux流程 */
  // useDispatch承担了store的dispatch action功能
  const dispatch = useDispatch();
  // useSelector承担了store的getState和subscribe功能，根据selector从store中获取值，并在该值更新时自动更新，引起视图渲染
  const baseInfo = useSelector(state => state.base);

  /* 自定义表单校验规则 */
  const validate = {
    phone(_, value) {
      value = value.trim();
      let reg = /^(?:(?:\+|00)86)?1\d{10}$/;
      if (value.length === 0) return Promise.reject(new Error('手机号必填!'));
      if (!reg.test(value)) return Promise.reject(new Error('手机号格式有误!'));
      return Promise.resolve('手机号验证成功');
    },
    code(_, value) {
      value = value.trim();
      let reg = /^\d{6}$/;
      if (value.length === 0) return Promise.reject(new Error('验证码必填!'));
      if (!reg.test(value)) return Promise.reject(new Error('验证码格式有误!'));
      return Promise.resolve('验证码验证成功 ');
    }
  }

  // 验证异步效果
  // const delay = (time = 1000) => {
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       resolve('success')
  //     }, time);
  //   })
  // }

  /* 节流发送验证码：倒计时 */
    // 注意不要用useState，因为点击触发倒计时效果之后，所有的计算都是在这个闭包中进行的，setNum拿到的始终是第一个闭包中的30（栈内存）
  // 而useRef和useState是不同的，useRef返回的是一个引用值对象，每次闭包拿到的num都是对象的堆内存地址，
  // 所以尽管闭包中num都是一个地址，但是通过引用值可以直接修改堆内存中的num
  // { 
  //   current: 30 // 你向 useRef 传入的值
  // }
  // 并且ref的变化不会和state一样引起重新渲染
  /* 发送验证码 */
  let timer = null,
      num = 31;
  const countdown = () => {
      num--;
      if (num === 0) {
          clearInterval(timer);
          timer = null;
          setSendText(`发送验证码`);
          setDisabled(false);
          return;
      } else {
        setSendText(`${num}秒后重发`);
      }
  };
  // 组件销毁时清除没有结束的定时器
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
  }, [])
  const send = async () => {
    dispatch(clearUserInfo())
    try {
      await formIns.validateFields(['phone']);
      // await delay(3000)
      // 手机验证码格式校验通过之后向服务器发请求
      let phone = formIns.getFieldValue('phone');
      let { code } = await api.sendPhoneCode(phone);
      // 发送失败
      if (+code !== 0) {
        Toast.show({
          icon: 'fail',
          content: '发送失败'
        });
        return;
      }
      // 发送成功之后节流【注意这个函数在外层被ButtonAgain包装了一层loading效果】
      setDisabled(true);
      countdown();
      if (!timer) timer = setInterval(countdown, 1000);
    } catch (error) {
      console.log(error);
    }
  }

  /* 接受到验证码之后表单提交 */
  const submit = async (value) => {
    // 手动表单校验
    try {
      await formIns.validateFields(); // 校验全部
      let { phone, code } = formIns.getFieldValue();
      let { code: codeHttp, token } = await api.login(phone, code);
      // 登陆失败的时候清空验证码
      if (+codeHttp !== 0) {
        Toast.show({
          icon: 'failed',
          content: '登陆失败'
        });
        formIns.resetFields(['code']);
        return;
      }
      
      // 登陆成功：存储token、存储登陆者信息到redux、提示、跳转
      _.storage.set('tk', token);
      console.log('ready to dispatch');
      dispatch(fetchUserInfo());
      console.log(baseInfo);
      Toast.show({
        icon: 'success',
        content: '登陆/注册成功'
      });

    } catch (error) {
      
    }
  }
  return (
    /* 
      Form
        layout 表单项布局方式，默认vertical
        footer 表单尾部，不表示表单项；如果在底部加上button，则表示一个表单项，
        而表单项之间默认有横线
        '--border-top'是adm支持的表单项之间的样式属性
      Form.Item
        name属性表示收集的信息存储到哪个字段中phone code
        extra属性指定表单项内部还有什么组件
    */
    <div className='login-box'>
      <NavBarAgain title="登录/注册" />
      <Form
        layout='horizontal'
        style={{ '--border-top': 'none' }}
        // 表单的自动校验：Button需要在Form里面【footer也算】，
        // 并且htmlType是submit才能触发表单自动校验【对于antd mobile，
        // type字段是submit能触发表单自动校验】
        footer={<ButtonAgain type='submit' color='primary' onClick={submit}>提交</ButtonAgain>}
        form={formIns}
        // onFinish={submit} 无法触发ButtonAgain里包装过的方法，转为手动校验
        initialValues={{phone: '', code: ''}}
      >
        <Form.Item name='phone' label='手机号'
          rules={[{ validator: validate.phone }]}>
            <Input placeholder='请输入手机号' />
        </Form.Item>

        <Form.Item name='code' label='验证码'
          required={false} // 是否带星号
          // 手动校验规则
          // rules={[{ validator: validate.code }]}
          // 内置校验规则
          rules={[
            { required: true, message: '验证码是必填项' },
            { pattern: /^\d{6}$/, message: '验证码格式错误' },
          ]}
          extra={<ButtonAgain size='small' color='primary'
            onClick={send}
            disabled={disabled}
          >{sendText}</ButtonAgain>}
        >
          <Input />
        </Form.Item>
      </Form>
  </div>)
}
