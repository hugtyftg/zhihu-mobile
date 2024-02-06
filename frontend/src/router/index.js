import { Suspense } from "react";
import routes from "./routes";
import { DotLoading, Mask } from 'antd-mobile';
import { Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
// 对路由表渲染的Element的处理
function Element(props) {
  let { component: Component, meta } = props;
  // 修改页面title
  let { title = '知乎日报-WebAPP' } = meta || {};
  document.title = title;

  // 获取路由信息，基于属性传递给组件
  const navigate = useNavigate(),
    location = useLocation(),
    params = useParams(),
    searchParams = useSearchParams();
  return <Component
    navigate={navigate}
    location={location}
    params={params}
    searchParams={searchParams}
  />
}
// 动态创建路由表，没有使用useRoutes，而是使用了更自由的方式
const RouterView = () => {
  // lazy异步加载，加载时有mask loading效果
  return <Suspense fallback={
    <Mask visible={true} opacity={'thick'}>
      <DotLoading color="white" />
    </Mask>
  }>
    <Routes>
      {routes.map(item => {
        return <Route
          key={item.name}
          path={item.path}
          element={<Element {...item} />}
        />
      })}
    </Routes>
  </Suspense>
}
export default RouterView;
