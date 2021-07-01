import { useState, useEffect } from 'react';
import * as systemApi from '@/api/system';

export function useMenuList() {
  const [menuList, setMenuList] = useState([]);
  function getMenuList() {
    systemApi.getMenuList().then(res => {
      const { menuTree = [] } = res.result || {};
      setMenuList(menuTree.filter(item => item.type !== '2'));
    })
  }
  useEffect(() => {
    getMenuList();
  }, [])
  return { menuList, getMenuList };
}
