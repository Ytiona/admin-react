import React, { memo, Suspense } from 'react'; 
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { HashRouter } from 'react-router-dom';

import routes from './router';
import store from './store';

import AppLoading from 'components/app-loading';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <Suspense fallback={<AppLoading/>}>
          { renderRoutes(routes) }
        </Suspense>
      </HashRouter>
    </Provider>
  );
}

export default memo(App);
