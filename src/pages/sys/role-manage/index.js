import React, { memo, useMemo } from 'react';
import { Table, Button, Switch, Input, Space, Drawer, Modal, Tag } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { useBool } from '@/hooks/base-hooks';
import AuthMenu from './auth-menu';
import RoleForm from './role-form';

const data = [
  {
    key: 1,
    role_name: '普通用户',
    role_code: 'ROLE_USER',
    role_level: 1,
    remarks: '',
    create_time: '2018-11-01 22:59:48',
    update_time: '2018-11-01 22:59:48',
    operate_user: 'admin',
    default_role: true
  },
  {
    key: 2,
    role_name: '管理员',
    role_code: 'ROLE_ADMIN',
    role_level: 10,
    remarks: '',
    create_time: '2018-11-01 22:59:48',
    update_time: '2018-11-01 22:59:48',
    operate_user: 'admin',
    default_role: false
  },
  {
    key: 3,
    role_name: '超级管理员',
    role_level: 100,
    role_code: 'ROLE_SUPER_ADMIN',
    remarks: '',
    create_time: '2018-11-01 22:59:48',
    update_time: '2018-11-01 22:59:48',
    operate_user: 'LY',
    default_role: false
  }
]

export default memo(function RoleManage() {
  const {
    state: authMenuVisible,
    setTrue: openAuthMenu,
    setFalse: closeAuthMenu 
  } = useBool();
  const {
    state: editRoleVisible,
    setTrue: openEditRole,
    setFalse: closeEditRole
  } = useBool();
  function deleteRole(role) {
    return () => {
      Modal.confirm({
        title: '确认删除？',
        content: `您确认要删除角色：${role.role_name}(${role.role_code})`
      })
    }
  }
  const roleColumns = useMemo(() => [
    { title: '角色名称', dataIndex: 'role_name', width: 200 },
    { title: '角色编码', dataIndex: 'role_code', width: 200 },
    { 
      title: '角色级别', 
      dataIndex: 'role_level',
      width: 90, 
      align: 'center',
      render: text => (
        <Tag>{ text }</Tag>
      )
    },
    {
      title: '默认角色',
      dataIndex: 'default_role',
      align: 'center',
      width: 100,
      render: default_role => (
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          defaultChecked={default_role}
        />
      )
    },
    { title: '备注', dataIndex: 'remarks', width: 200 },
    { title: '操作人', dataIndex: 'operate_user', width: 180 },
    { title: '创建时间', dataIndex: 'create_time', sorter: true, width: 180, align: 'center' },
    { title: '更新时间', dataIndex: 'update_time', sorter: true, width: 180, align: 'center' },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 260,
      render: (text, record) => (
        <>
          <Button size="small" type="link" onClick={openAuthMenu}>菜单权限</Button>
          <Button size="small" type="link">接口权限</Button>
          <Button size="small" type="link" onClick={openEditRole}>编辑</Button>
          <Button size="small" type="link" onClick={deleteRole(record)}>删除</Button>
        </>
      )
    }
  ], [openAuthMenu])
  return (
    <>
      <div className="flex between mb-10">
        <Space>
          <Button type="primary">添加角色</Button>
          <Button>批量删除</Button>
        </Space>
        <Input.Search placeholder="输入关键词搜索" enterButton className="w-300" />
      </div>
      <Table
        bordered
        size="middle"
        scroll={{ x: true }}
        rowSelection={{ fixed: true, columnWidth: 50 }}
        columns={roleColumns}
        dataSource={data}
        pagination={{
          showQuickJumper: true,
        }}
      ></Table>
      <Drawer 
        width={600} 
        title="菜单权限"
        visible={authMenuVisible} 
        onClose={closeAuthMenu} 
        footer={
          <Space className="flex flex-end">
            <Button onClick={closeAuthMenu}>取消</Button>
            <Button type="primary">确定</Button>
          </Space>
        }
      >
        <AuthMenu/>
      </Drawer>
      <Modal visible={editRoleVisible} title="编辑角色" width={500} onCancel={closeEditRole}>
        <RoleForm isEdit/>
      </Modal>
    </>
  )
})
