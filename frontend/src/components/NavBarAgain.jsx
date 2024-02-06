import React from 'react';
import PropTypes from 'prop-types';
import { NavBar } from 'antd-mobile';
// 对UI组件库中的NavBar的二次封装，添加复杂逻辑
export default function NavBarAgain(props) {
  const { title } = props;
  const handleBack = () => {
    // 复杂的返回逻辑
  };
  return (
    <NavBar className="navbar-again-box" onBack={handleBack}>
      {title}
    </NavBar>
  );
}
// 函数组件的规则校验和默认值
NavBarAgain.defaultProps = {
  title: '个人中心',
};
NavBarAgain.propTypes = {
  title: PropTypes.string,
};
