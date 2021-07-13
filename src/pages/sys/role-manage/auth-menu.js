import React, { memo, useRef, useEffect, useState } from 'react';
import { Drawer, Space, Button } from 'antd';
import MenuList from '../menu-manage/menu-list';
import { useMenuList } from '../menu-manage/hooks';
import * as systemApi from '@/api/system';

export default memo(function AuthMenu({
  role,
  visible,
  setHide
}) {
  const [roleMenu, setRoleMenu] = useState([]);
  useEffect(() => {
    if (!visible) return;
    systemApi.getRoleMenu({
      roleCode: role.code
    }).then(res => {
      setRoleMenu(res.result || []);
    })
  }, [visible])
  const { menuList } = useMenuList();
  const checkedMenus = useRef();
  function roleMenuAuth() {
    systemApi.roleMenuAuth({
      roleCode: role.code,
      menuIds: checkedMenus.current
    }).then(() => {
      setHide();
    })
  }
  function onCheckNode(checkedKeys, { checkedNodes, halfCheckedKeys }) {
    checkedMenus.current = checkedNodes.map(item => item.id).concat(halfCheckedKeys);
  }
  return (
    <Drawer
      width={600}
      title="菜单权限"
      visible={visible}
      onClose={setHide}
      footer={
        <Space className="flex flex-end">
          <Button onClick={setHide}>取消</Button>
          <Button type="primary" onClick={roleMenuAuth}>确定</Button>
        </Space>
      }
    >
      <MenuList
        checkable
        showIcon
        showLine={{ showLeafIcon: false }}
        style={{ color: '#515a6e' }}
        menuList={menuList}
        defaultCheckedKeys={roleMenu}
        onCheck={onCheckNode}
      />
    </Drawer>
  )
})
