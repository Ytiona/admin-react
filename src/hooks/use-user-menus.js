import React, { useEffect, useState, useCallback } from 'react';
import { Route } from 'react-router-dom';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import * as userApi from '@/api/user';

export default function useUserMenus() {
  const { token, menuList } = useSelector(state => ({
    token: state.getIn(['user', 'token']),
    menuList: state.getIn(['user', 'menuList'])
  }), shallowEqual)
  const dispatch = useDispatch();
  const [Routes, setRoutes] = useState([]);
  const getUserMenuList = useCallback(() => {
    return userApi.getUserMenuList().then(res => {
      const data = res.result || {};
      const routes = data.routes || [];
      setRoutes(routes.map(item => {
        return <Route
          exact
          key={item.path}
          path={item.path}
          component={React.lazy(() => import(`@/pages${item.component_path || item.path}`))}
        />
      }));
      dispatch({ type: 'setUserMenuList', data: data.menuTree });
      return res;
    })
  }, [dispatch])
  useEffect(() => {
    if (!token) return;
    getUserMenuList();
  }, [dispatch, token, getUserMenuList])
  return {
    token,
    menuList,
    Routes,
    getUserMenuList
  }
}
