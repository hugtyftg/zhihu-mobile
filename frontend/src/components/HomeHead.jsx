import React, { useMemo } from 'react';
import './HomeHead.less';
import timg from '../assets/images/timg.jpg';
export default function HomeHead(props) {
  const { today } = props;
  /* 计算时间中的日和月 */
  let time = useMemo(() => {
    let [, month, day] = today.match(/^\d{4}(\d{2})(\d{2})$/);
    const monthMap = [
      '零',
      '一',
      '二',
      '三',
      '四',
      '五',
      '六',
      '七',
      '八',
      '九',
      '十',
      '十一',
      '十二',
    ];
    return {
      month: monthMap[+month] + '月',
      day,
    };
  }, [today]);
  return (
    <div className="home-head-box">
      <div className="info">
        <div className="time">
          <span className="Day">{time.day}</span>
          <span className="Month">{time.month}</span>
        </div>
        <div className="title">知乎日报</div>
      </div>
      <div className="picture">
        {/* 打包之后项目的目录结构会改变，找不到图片的原有地址
        <img src="../assets/images/timg.jpg" alt="默认头像" /> */}
        <img src={timg} alt="默认头像" />
      </div>
    </div>
  );
}
