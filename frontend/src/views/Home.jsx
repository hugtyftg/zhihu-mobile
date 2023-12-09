import React, { useEffect, useRef, useState } from 'react';
import HomeHead from '../components/HomeHead';
import _ from '../assets/utils';
import './Home.less'
import { Divider, DotLoading, Image, Swiper } from 'antd-mobile';
import SkeletonAgain from '../components/SkeletonAgain';
import NewsItem from '../components/NewsItem';
import { Link } from 'react-router-dom';
import api from '../api/index'
import { message } from 'antd';

export default function Home() {
  /* 创建所需状态 */
  // 没有从服务器拿到时间的时候展示当前时间，拿到服务器数据后才展示服务器数据时间
  let [today, setToday] = useState(_.formatTime(null, "{0}{1}{2}")); // 传的不是字符串就可以获取当前时间
  let [bannerData, setBannerData] = useState([]);
  let [newsList, setNewsList] = useState([]); // 每一项代表一天的新闻
  let loadMore = useRef(null);

  /* 第一次渲染完毕：向服务器发送数据请求
  （注意不要在useEffect的顶层callback中使用async，否则默认返回Promise而不是函数） */
  useEffect(() => {
    (async ()=> {
      try {
        let { date, stories, top_stories } = await api.queryNewsLatest()
        setToday(date);
        setBannerData(top_stories);
        let newNewsList = [...newsList, {
          date, stories
        }]
        setNewsList(newNewsList)
      } catch (error) {
        
      }
    })()
  }, [])

  /* 第一次渲染完毕：设置监听器，实现触底加载 */
  useEffect(() => {
    // 创建监听器并监听指定DOM元素和可视窗口的交叉状态
    // 如果交叉状态发生变化，比如出现或离开可视范围，都会触发回调函数
    let ob = new IntersectionObserver(async changes => {
      let { isIntersecting } = changes[0];
      // isIntersecting: Boolean，true为出现在视口中，也就是触底了；false没出现在视口中，未触底
      if (isIntersecting) {
        // 每次新数据都是最后一项
        try {
          let time = newsList[newsList.length - 1]['date'];
          let res = await api.queryNewsBefore(time);
          newsList.push(res);
          setNewsList([...newsList]);
        } catch (_) { };

      }
    });
    let loadMoreDOM = loadMore.current;
    ob.observe(loadMore.current);

    // 在组件销毁释放的时候，手动销毁监听器
    // unobserver方法在DOM卸载完毕之后才会执行，此时loadMore.current=null，因此无法通过loadMore找到对应的变量。
    // 在上面的闭包中保存一个变量loadMoreDOM，组件卸载后仍能通过loadMoreDOM解除监听器
    return () => {
      ob.unobserve(loadMoreDOM);
      ob = null;
    }
  }, [])

  return (
    <div className='home-box'>
      {/* header */}
      <HomeHead today={today} />

       {/* 轮播图 */}
      <div className="swiper-box">
        {bannerData.length > 0 ? <Swiper autoplay={true} loop={true}>
          {/* 根据从服务器拿到的数据来循环配置 */}
          {bannerData.map(item => {
            let { id, image, title, hint } = item;
            return <Swiper.Item key={id}>
              <Link to={`/detail/${id}`}>
                <Image lazy src={image} />
                <div className="desc">
                  <h3 className="title">{title}</h3>
                  <p className="author">{hint}</p>
                </div>
              </Link>
            </Swiper.Item>})
          }
          </Swiper> : null
        }
      </div>

      {/* 新闻列表，每天的新闻是一个列表 */}
      {newsList.length === 0 ?
        <SkeletonAgain /> : 
        <>
          {
            newsList.map((item, index) => {
              return <div className='news-box' key={item.date}>
                {index === 0 ? null : <Divider
                  contentPosition='left'
                  children={_.formatTime(item.date, "{0}{1}{2}")}
                />}
                {
                  item.stories.map(newsItem => {
                    return <NewsItem key={newsItem.id}
                      id={newsItem.id}
                      image={newsItem.images[0]}
                      title={newsItem.title}
                      hint={newsItem.hint}
                    />
                  })
                }
              </div>
            })
          }
        </>
      }

      {/* 加载更多 */}
      <div className="loadmore-box" ref={loadMore}
        style={{
          display: newsList.length > 0 ? 'block' : 'none'
        }}
      >
        <DotLoading />
        <span className="tip">数据加载中</span>
      </div>
    </div>
  )
}