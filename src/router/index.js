import React from 'react';
import { Redirect } from 'react-router-dom';

const routes = [
  {
    path: '/',
    exact: true,
    render: () => (
      <Redirect to="/home"/>
    )
  },
  {
    path: '/home',
    exact: true,
    component:  React.lazy(() => import("@/pages/home"))
  },
  {
    path: '/login',
    exact: true,
    component: React.lazy(() => import("@/pages/login"))
  }
]

export default routes;