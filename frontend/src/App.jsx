import './App.less';
// import { queryNewsLatest } from './api';
import RouterView from './router';
// import routes from './router/UseRoutes';
// import { useRoutes } from 'react-router-dom';

function App() {
  // const data = queryNewsLatest();
  // console.log(data);
  // const elememt = useRoutes(routes);
  return (
    <div className="App">
      <RouterView/>
    </div>
  );
}

export default App;  