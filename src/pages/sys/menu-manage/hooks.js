import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import * as systemApi from '@/api/system';

export function useMenuList() {
  const menuList = useSelector(state => state.getIn(['system', 'menuList']), shallowEqual);
  const dispatch = useDispatch();
  const getMenuList = useCallback(() => {
    systemApi.getMenuList().then(res => {
      const { menuTree = [] } = res.result || {};
      dispatch({ type: 'setSystemMenuList', data: menuTree.filter(item => item.type !== '2') })
    })
  }, [dispatch])
  useEffect(() => {
    getMenuList();
  }, [getMenuList])
  return { menuList, getMenuList };
}
