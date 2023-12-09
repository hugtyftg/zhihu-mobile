// 封装后端接口
import http from './http';
const queryNewsLatest = () => http.get('/api/news_latest');
const queryNewsBefore = (time) =>
  http.get('/api/news_before', {
    params: {
      time
    }
  });
const queryNewsInfo = (id) =>
  http.get('/api/news_info', {
    params: {
      id
    }
  });
const queryStoryExtra = (id) =>
  http.get('/api/story_extra', {
    params: {
      id
    }
  });
// 发送验证码
const sendPhoneCode = (phone) => { 
  return http.post('/api/phone_code', {
    phone
  })
}
// 登陆/注册
const login = (phone, code) => {
  return http.post('api/login', {
    phone,
    code
  })
}
/* 获取登陆者信息 */
// 不用再传参，所需token已经在封装的fetch里面处理过
const queryUserInfo = () => http.get('/api/user_info');
const api = {
  queryNewsBefore,
  queryNewsInfo,
  queryNewsLatest,
  queryStoryExtra,
  sendPhoneCode,
  login,
  queryUserInfo,
}

export default api;