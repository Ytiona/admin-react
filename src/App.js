import React, { memo, Suspense } from 'react'; 
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { Router } from 'react-router-dom';
import { createHashHistory } from 'history';

import routes from './router';
import store from './store';

import AppLoading from '@/components/app-loading';


import '@/utils/window';
import './App.css';

const history = createHashHistory();

const token = localStorage.getItem('token');
if(token) {
  store.dispatch({ type: 'setToken', data: token });
} else {
  history.replace('/login');
}

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Suspense fallback={<AppLoading/>}>
          { renderRoutes(routes) }
        </Suspense>
      </Router>
    </Provider>
  );
}

export default memo(App);
