/*
 http([config])
   + url 请求地址
   + method 请求方式  *GET/DELETE/HEAD/OPTIONS/POST/PUT/PATCH
   + credentials 携带资源凭证  *include/same-origin/omit
   + headers:null 自定义的请求头信息「格式必须是纯粹对象」
   + body:null 请求主体信息「只针对于POST系列请求，根据当前服务器要求，如果用户传递的是一个纯粹对象，我们需要把其变为urlencoded格式字符串(设定请求头中的Content-Type)...」
   + params:null 设定问号传参信息「格式必须是纯粹对象，我们在内部把其拼接到url的末尾」
   + responseType 预设服务器返回结果的读取方式  *json/text/arrayBuffer/blob
   + signal 中断请求的信号
 -----
 http.get/head/delete/options([url],[config])  预先指定了配置项中的url/method
 http.post/put/patch([url],[body],[config])  预先指定了配置项中的url/method/body
 */
// 1.快捷写法中，传入的url和body是独立于config之外的，在内部要将其转化成核心写法
// 2.http核心方法的config校验与默认值：利用Object.assign方法，用config替换默认值的重复项，得到新的config即为所求
// 3.对合并得到的config进行规则校验
// 4.基于config得到发送fetch时的fetchOptions
// 5.基于response.status处理各种状态，提示信息
// 底层用fetch发请求
import _ from '../assets/utils';
import qs from 'qs';
import { message } from 'antd';

/* 核心方法 */
const http = function http(config) {
  // initial config & validate 「扩展：回去后，可以尝试对每一个配置项都做校验?」
  if (!_.isPlainObject(config)) config = {};
  config = Object.assign(
    {
      url: '',
      method: 'GET',
      credentials: 'include',
      headers: null,
      body: null,
      params: null,
      responseType: 'json',
      signal: null,
    },
    config
  );
  if (!config.url) throw new TypeError('url must be required');
  if (!_.isPlainObject(config.headers)) config.headers = {};
  if (config.params !== null && !_.isPlainObject(config.params))
    config.params = null;

  let {
    url,
    method,
    credentials,
    headers,
    body,
    params,
    responseType,
    signal,
  } = config;

  // 处理问号传参
  /* 字符串传参格式：
    我的名字叫，年龄35岁, 不抽烟
    A. 用urlencoded格式表述为：name=呱呱&age=35&smoke=false
    B. 用JSON格式表述为：
    {
      “name” :“呱呱”,
      “age”:35,
      “smoke”:false
    }
  */
  if (params) {
    url += `${url.includes('?') ? '&' : '?'}${qs.stringify(params)}`;
  }

  // POST请求选用urlencoded格式 类似query string name=章三&age=19 注意没有问号
  // 处理请求主体信息：按照我们后台要求，如果传递的是一个普通对象，我们要把其设置为urlencoded格式「设置请求头」？
  if (_.isPlainObject(body)) {
    body = qs.stringify(body);
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  // 类似于axios中的请求拦截器：每一个请求，递给服务器相同的内容可以在这里处理「例如：token」
  // 对指定的几个接口处理token，其他接口不需要传递
  // 本项目的token使用localstorage存储，并且封装在 @/assets/utils.js中，key为tk
  // let token = localStorage.getItem('tk');
  let token = _.storage.get('tk'),
    safeList = [
      '/user_info',
      '/user_update',
      '/store',
      '/store_remove',
      'store_list',
    ];
  if (token) {
    let reg = /\/api(\/[^?#]+)/,
      [, $1] = reg.exec(url);
    // 当前url是否在需要传token的safelist中
    let isSafe = safeList.some((item) => {
      return $1 === item;
    });
    if (isSafe) {
      headers['authorization'] = token;
    }
  }

  // 发送请求
  method = method.toUpperCase();
  let fetchOptions = {
    method,
    credentials,
    headers,
    cache: 'no-cache',
    signal,
  };
  if (/^(POST|PUT|PATCH)$/i.test(method) && body) fetchOptions.body = body;
  return fetch(url, fetchOptions)
    .then((response) => {
      let { status, statusText } = response;
      if (/^(2|3)\d{2}$/.test(status)) {
        // 请求成功:根据预设的方式，获取需要的值
        let result;
        switch (responseType.toLowerCase()) {
          case 'text':
            result = response.text();
            break;
          case 'arraybuffer':
            result = response.arrayBuffer();
            break;
          case 'blob':
            result = response.blob();
            break;
          default:
            result = response.json();
        }
        return result;
      }
      // 请求失败：HTTP状态码失败
      return Promise.reject({
        code: -100,
        status,
        statusText,
      });
    })
    .catch((reason) => {
      // 失败的统一提示
      message.error('当前网络繁忙，请您稍后再试~');
      return Promise.reject(reason); //统一处理完提示后，在组件中获取到的依然还是失败
    });
};

/* 快捷方法 */
['GET', 'HEAD', 'DELETE', 'OPTIONS'].forEach((item) => {
  http[item.toLowerCase()] = function (url, config) {
    if (!_.isPlainObject(config)) config = {};
    config['url'] = url;
    config['method'] = item;
    return http(config);
  };
});
['POST', 'PUT', 'PATCH'].forEach((item) => {
  http[item.toLowerCase()] = function (url, body, config) {
    if (!_.isPlainObject(config)) config = {};
    config['url'] = url;
    config['method'] = item;
    config['body'] = body;
    return http(config);
  };
});

export default http;
