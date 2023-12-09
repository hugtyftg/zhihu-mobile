import { Badge } from 'antd-mobile'
import { LeftOutline, LikeOutline, MessageOutline, MoreOutline, StarOutline } from 'antd-mobile-icons'
import React, { useEffect, useState } from 'react'
import './Detail.less'
import api from '../api/index';
import SkeletonAgain from '../components/SkeletonAgain';
import { flushSync } from 'react-dom';
export default function Detail(props) {
  // router view里面已经对navigate params等封装了
  let { navigate, params } = props;

  let [info, setInfo] = useState(null);
  let [extra, setExtra] = useState(null);



  /* 第一次渲染完毕获取文字内容、评论点赞数等数据，这些数据的获取是并行的，
  因此不能在同一个useEffect中多次await，因为await表面上是同步阻塞代码 */
  // 拿到result中的样式并将其载入页面
  const handleStyle = (result) => { 
    let { css } = result;
    if (!Array.isArray(css)) return;
    css = css[0];
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = css;
    document.head.appendChild(link)
  };
  // 拿到result中的图片并将其载入页面
  const handleImage = (result) => { 
    let imgPlaceHolder = document.querySelector('.img-place-holder');
    if (!imgPlaceHolder) return;
    // 创建大图
    let tempImg = new Image; // 相当于创建了一个img DOM
    tempImg.src = result.image;
    // 页面或图片元素加载完成后出发onLoad事件
    tempImg.onload = () => {
      imgPlaceHolder.appendChild(tempImg);
    }
    // 如果图片数据请求失败，直接移除.img-place-holder的父元素headline
    tempImg.onerror = () => {
      let parent = imgPlaceHolder.parentNode;
      parent.parentNode.removeChild(parent);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        let result = await api.queryNewsInfo(params.id);
        // 需求：result数据异步更新完成后立刻执行两个handle
        // 方案三：
        flushSync(() => {
          setInfo(result);
          handleStyle(result);
        })
        // 方案一：直接传参
        handleImage(result);
      } catch (error) {
        
      }
    })()
  }, []);
  // 方案二：监听info，改变后执行方法
  // useEffect(() => {
  //   handleStyle(info);
  //   handleImage(info);
  // }, [info])
  useEffect(() => {
    (async () => {
      try {
        let result = await api.queryStoryExtra(params.id);
        setExtra(result);
      } catch (error) {
        
      }
    })()
  }, []);

  return (
    <div className='detail-box'>
      {/* 新闻内容 */}
      {/* 使用dangerousSetInnerHtml在react中插入html标签 */}
      {!info ? <SkeletonAgain /> : 
        <div className="content" dangerouslySetInnerHTML={{
          __html: info.body
        }}></div>
      }

      {/* 底部图标 */}
      <div className="tab-bar">
        <div className="back"
          onClick={() => navigate(-1)}
        >
          <LeftOutline/>
        </div>
        <div className="icons">
          <Badge content={ extra ? extra.comments : '0' }><MessageOutline /></Badge>
          <Badge content={ extra ? extra.popularity : '0' }><LikeOutline /></Badge>
          <span className='stored'><StarOutline /></span>
          <span><MoreOutline /></span>
        </div>
      </div>
    </div>
  )
}