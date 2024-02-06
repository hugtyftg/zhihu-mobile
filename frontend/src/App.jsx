// import { queryNewsLatest } from './api';
import RouterView from './router';
import { DotLoading, Mask } from 'antd-mobile';
import { Suspense } from 'react';
import routes from './router/UseRoutes';
import { useRoutes } from 'react-router-dom';

function App() {
  const elememt = useRoutes(routes);
  return (
    <div className="App">
      {/* 统一包装写法 */}
      {/* <RouterView /> */}

      {/* hooks写法 */}
      <Suspense
        fallback={
          <Mask visible={true} opacity={'thick'}>
            <DotLoading color="white" />
          </Mask>
        }
      >
        {elememt}
      </Suspense>
    </div>
  );
}

export default App;
