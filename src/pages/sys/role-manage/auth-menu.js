import React, { memo, useRef } from 'react';
import MenuList from '../menu-manage/menu-list';
import { useMenuList } from '../menu-manage/hooks';

export default memo(function AuthMenu() {
  const { menuList } = useMenuList();
  const checkedMenus = useRef();
  function onSelectNode() {
    
  }
  return (
    <MenuList
      checkable
      showIcon
      showLine={{ showLeafIcon: false }}
      style={{ color: '#515a6e' }}
      menuList={menuList}
      onCheck={checkedKeys => { checkedMenus.current = checkedKeys; }}
      onSelect={onSelectNode}
    />
  )
})
