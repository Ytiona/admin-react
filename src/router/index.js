import React from 'react';

const routes = [
  {
    path: '/login',
    exact: true,
    component: React.lazy(() => import("@/pages/login"))
  },
  {
    path: '/',
    component: React.lazy(() => import("@/pages/home")),
  },
  {
    path: '*',
    component: React.lazy(() => import('@/pages/not-found'))
  }
]

export default routes;