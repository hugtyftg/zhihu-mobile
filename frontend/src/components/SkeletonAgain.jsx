import React from 'react'
import { Skeleton } from 'antd-mobile'
import './SkeletonAgain.less'
// 对UI组件库skeleton的二次封装，目的是将多个UI组件作为一个整体设置一些通用的样式
export default function SkeletonAgain() {
  return (
    <div className='skeleton-again-box'>
      <Skeleton.Title animated />
      <Skeleton.Paragraph lineCount={5} animated/>
    </div>
  )
}