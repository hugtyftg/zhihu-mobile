import React from 'react'
import './NewsItem.less'
import {Image} from 'antd-mobile'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
export default function NewsItem(props) {
  let { id, image, title, hint } = props;
  // 如果传过来的image不是一个字符串图片地址，那么也不会报错，只是加载不出来图片
  if (typeof image !== 'string') {
    image = '';
  }
  return (
    <div className='news-item-box'>
      <Link to={`/detail/${id}`}>
        <div className="content">
          <h3 className="title">
            {title}
          </h3>
          <p className="author">
            {hint}
          </p>
        </div>
        <Image src={image} lazy/>
      </Link>
    </div>
  )
}
NewsItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
}