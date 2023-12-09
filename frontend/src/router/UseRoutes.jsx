import Home from "../views/Home";
import { Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
const Loading = <h1>loading</h1>
const Detail = lazy(() => import('@/views/Detail'));
const Login = lazy(() => import('@/views/Login'));
const Page404 = lazy(() => import('@/views/Page404'));
const Personal = lazy(() => import('@/views/Personal'));
const Store = lazy(() => import('@/views/Store'));
const Update = lazy(() => import('@/views/Update'));
// function LazyLoad(url) {
//   const Element = lazy(() => import(url));
//   return <Suspense fallback={Loading}>
//     <Element/>
//   </Suspense>
// }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
const routes = [
  {
    path: '/',
    element: <Navigate to={'/home'}/>
  },
  {
    path: '/home',
    element: <Home />,
    meta: {
      title: '知乎日报-WebAPP'
    }
  },
  {
    path: '/detail/:id',
    name: 'detail',
    element: <Suspense fallback={Loading}><Detail/></Suspense>,
    meta: {
      title: '知乎日报-WebAPP'
    }
  },
  {
    path: '/personal',
    element: <Suspense fallback={Loading}><Personal/></Suspense>
  },
  {
    path: '/store',
    name: 'store',
    element: <Suspense fallback={Loading}><Store/></Suspense>,
    meta: {
      title: '个人收藏-知乎日报'
    }
  }, {
    path: '/update',
    name: 'update',
    element: <Suspense fallback={Loading}><Update/></Suspense>,
    meta: {
      title: '修改个人信息-知乎日报'
    }
  },
  {
    path: '/login',
    name: 'login',
    element: <Suspense fallback={Loading}><Login/></Suspense>,
    meta: {
      title: '登陆/注册-知乎日报'
    }
  },
  {
    path: '*',
    name: '404',
    element: <Suspense fallback={Loading}><Page404/></Suspense>,
    meta: {
      title: '404页面-知乎日报'
    }
  },
]
export default routes;