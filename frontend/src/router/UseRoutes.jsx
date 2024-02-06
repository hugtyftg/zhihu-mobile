import Home from '../views/Home';
import { Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
const Loading = <h1>loading</h1>;
const Detail = lazy(() => import('@/views/Detail'));
const Login = lazy(() => import('@/views/Login'));
const Page404 = lazy(() => import('@/views/Page404'));
const Personal = lazy(() => import('@/views/Personal'));
const Store = lazy(() => import('@/views/Store'));
const Update = lazy(() => import('@/views/Update'));
const routes = [
  {
    path: '/',
    element: (
      <Navigate
        to={'/home'}
        meta={{
          name: 'navigate',
          title: '知乎日报-WebApp',
        }}
      />
    ),
  },
  {
    path: '/home',
    element: (
      <Home
        meta={{
          name: 'navigate',
          title: '知乎日报-WebApp',
        }}
      />
    ),
  },
  {
    path: '/detail/:id',
    element: (
      <Detail
        meta={{
          name: 'detail',
          title: '新闻详情-知乎日报',
        }}
      />
    ),
  },
  {
    path: '/personal',
    element: (
      <Personal
        meta={{
          name: 'personal',
          title: '个人中心-知乎日报',
        }}
      />
    ),
  },
  {
    path: '/store',
    element: (
      <Store
        meta={{
          name: 'store',
          title: '个人收藏-知乎日报',
        }}
      />
    ),
  },
  {
    path: '/update',
    element: (
      <Update
        meta={{
          name: 'update',
          title: '修改个人信息-知乎日报',
        }}
      />
    ),
  },
  {
    path: '/login',
    element: (
      <Login
        mets={{
          name: 'login',
          title: '登陆/注册-知乎日报',
        }}
      />
    ),
  },
  {
    path: '*',
    element: (
      <Page404
        meta={{
          name: '404',
          title: '404页面-知乎日报',
        }}
      />
    ),
  },
];
export default routes;
