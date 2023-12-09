import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
/* reduxjs/toolkit */
import { Provider } from 'react-redux';
import store from './redux/store';
/* react-router 6 */
import {BrowserRouter} from 'react-router-dom';
// import http from './api/http';
// fetch('/api/subscriptions/recommended_collections')
// let ctrol = new AbortController();
// fetch('/api/getTaskList', {
//   signal: ctrol.signal
// })
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(message => console.log(message))
// ctrol.abort();  
// let ctrl = new AbortController();
// http.get('/api/getTaskList', {
//   params: {
//     state: 2
//   },
//   signal: ctrl.signal
// }).then(response => {
//   console.log('成功', response)
// })
// ctrl.abort()
/* antd-mobile */
import { ConfigProvider } from 'antd-mobile';
import zhCN from 'antd-mobile/es/locales/zh-CN';

/* 样式处理 */
import './index.less';

/* 移动端适配，自动根据设备等比例计算rem */
import 'lib-flexible';

/* 
 处理最大宽度750
 注意：媒体查询会失效，因为也是在less文件中，px会被转换成rem
 IIFE在最开始载入的时候后于flexible执行，但是在谷歌模拟器中切换的时候，先于flexible执行，所以fontSize修改不成功
*/
(function () {
  const computed = () => {
    let html = document.documentElement;
    let deviceWidth = html.clientWidth;
    html.style.maxWidth = '750px'
    if (deviceWidth >= 750) {
      html.style.fontSize = '75px'
      return;
    }
  }
  computed();
  window.addEventListener('resize', computed);
}())

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* antd mobile 国际化 */}
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Provider store={store}>
          <App />    
        </Provider>
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
