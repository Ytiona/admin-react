import '@/utils/window';
import React, { memo, Suspense } from 'react'; 
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Router } from 'react-router-dom';
import history from '@/router/history';
import routes from './router';
import store from './store';
import AppLoading from '@/components/app-loading';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import '@/lib/login';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <Router history={history}>
          <Suspense fallback={<AppLoading/>}>
            { renderRoutes(routes) }
          </Suspense>
        </Router>
      </Provider>
    </ConfigProvider>
  );
}

export default memo(App);
