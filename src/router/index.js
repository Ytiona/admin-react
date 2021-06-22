import React from 'react';
import { Redirect } from 'react-router-dom';
import NotFound from '@/pages/not-found';

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
  },
  {
    path: '*',
    component: React.lazy(() => import('@/pages/not-found'))
  }
]

export default routes;