import React, { memo, useMemo, useRef, useState } from 'react';
import { Button, Switch, Space, Modal, Tag, message } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { useBool } from '@/hooks/base-hooks';
import AuthMenu from './auth-menu';
import AuthApi from './auth-api';
import PageTable from '@/components/page-table';
import RoleModal from './role-modal';
import * as systemApi from '@/api/system';

export default memo(function RoleManage() {
  const roleListRef = useRef({});
  const [currentRole, setCurrentRole] = useState({});

  const {
    state: authMenuVisible,
    setTrue: openAuthMenu,
    setFalse: closeAuthMenu
  } = useBool();

  const {
    state: authApiVisible,
    setTrue: openAuthApi,
    setFalse: closeAuthApi
  } = useBool();

  const {
    state: addRoleVisible,
    setFalse: closeAddRole,
    setTrue: openAddRole
  } = useBool();

  const {
    state: editRoleVisible,
    setTrue: openEditRole,
    setFalse: closeEditRole
  } = useBool();

  const selectRoles = useRef([]);
  function deleteRole(roles) {
    if (!roles.length) return message.error('请选择角色');
    Modal.confirm({
      onOk: () => {
        systemApi.batchDeleteRole({
          roleIds: roles.map(item => item.id)
        }).then(roleListRef.current.getList)
      },
      title: '确认删除？',
      content: <>
        <p>{`您确认要删除角色：`}</p>
        <ul>
          {
            roles.map(item => (
              <li key={item.code}>
                {item.name}
                <span className="ml-5 min-desc">{item.code}</span>
              </li>
            ))
          }
        </ul>
      </>
    })
  }

  function operateRole(fn, record) {
    return () => {
      setCurrentRole(record);
      fn();
    }
  }
  
  const roleColumns = useMemo(() => [
    { title: '角色名称', dataIndex: 'name', width: 200 },
    { title: '角色编码', dataIndex: 'code', width: 200 },
    {
      title: '角色级别',
      dataIndex: 'level',
      width: 90,
      align: 'center',
      render: text => (
        <Tag>{text}</Tag>
      )
    },
    {
      title: '默认角色',
      dataIndex: 'is_default',
      align: 'center',
      width: 100,
      render: is_default => (
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          defaultChecked={is_default}
        />
      )
    },
    { title: '备注', dataIndex: 'remarks', width: 200 },
    { title: '操作人', dataIndex: 'operater', width: 180 },
    { title: '操作时间', dataIndex: 'update_time', sorter: true, width: 180, align: 'center' },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 260,
      render: (text, record) => (
        <>
          <Button size="small" type="link" onClick={operateRole(openAuthMenu, record)}>菜单权限</Button>
          <Button size="small" type="link" onClick={operateRole(openAuthApi, record)}>接口权限</Button>
          <Button
            size="small"
            type="link"
            onClick={operateRole(openEditRole, record)}
          >编辑</Button>
          <Button size="small" type="link" onClick={() => deleteRole([record])}>删除</Button>
        </>
      )
    }
  ], [openAuthMenu, openEditRole])

  return (
    <>
      <PageTable
        ref={roleListRef}
        initGet
        showSearch
        getListFn={systemApi.getRoleList}
        columns={roleColumns}
        topLeft={
          <Space>
            <Button type="primary" onClick={openAddRole}>添加角色</Button>
            <Button onClick={() => deleteRole(selectRoles.current)}>批量删除</Button>
          </Space>
        }
        rowSelection={{
          fixed: true,
          columnWidth: 50,
          onChange: (keys, rows) => selectRoles.current = rows
        }} 
      />
      <AuthMenu visible={authMenuVisible} setHide={closeAuthMenu} role={currentRole}/>
      <AuthApi visible={authApiVisible} setHide={closeAuthApi} role={currentRole}/>
      <RoleModal
        visible={addRoleVisible}
        setHide={closeAddRole}
        requestFn={systemApi.addRole}
        onFinish={roleListRef.current.getList}
      />
      <RoleModal
        visible={editRoleVisible} 
        setHide={closeEditRole} 
        requestFn={systemApi.updateRole}
        onFinish={roleListRef.current.getList} 
        role={currentRole} 
      />
    </>
  )
})
