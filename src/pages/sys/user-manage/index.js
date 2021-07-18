import React, { memo, useMemo, useCallback, useRef } from 'react';
import PageTable from '@/components/page-table';
import * as systemApi from '@/api/system';
import { Button, Tag, Avatar, Form, Input, Select, Space } from 'antd';
import { UserOutlined, SearchOutlined, UserAddOutlined, StopOutlined, DeleteOutlined } from '@ant-design/icons';
import { useBool } from '@/hooks/base-hooks';
import UserModal from './user-model';

const UserManage = memo(function () {
  const onDisableUser = useCallback(() => {

  }, [])
  const onDeleteRole = useCallback(() => {
    
  }, [])
  const userColumns = useMemo(() => [
    { 
      title: '头像', dataIndex: 'avatar', 
      align: 'center', width: 100,
      render: avatar => (
        <Avatar size={30} icon={<UserOutlined />} />
      )
    },
    { title: '姓名', dataIndex: 'name' },
    { title: '账号', dataIndex: 'account' },
    { title: '手机', dataIndex: 'phone', align: 'center', width: 150 },
    { 
      title: '角色', 
      dataIndex: 'role', 
      align: 'center',
      width: 240,
      render: role => (
        <Tag color="processing">{role}</Tag>
      )
    },
    { 
      title: '状态', dataIndex: 'enabled', 
      align: 'center', width: 120,
      render: enabled => (<>
        {
          enabled ? 
          <Tag color="success">启用</Tag> :
          <Tag color="error">禁用</Tag>
        }
      </>)
    },
    { title: '创建时间', dataIndex: 'create_time', align: 'center', width: 160 },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 180,
      render: (text, record) => (
        <>
          <Button size="small" type="link" onClick={openEditUser}>编辑</Button>
          <Button size="small" type="link" onClick={onDisableUser}>禁用</Button>
          <Button size="small" type="link" onClick={onDeleteRole}>删除</Button>
        </>
      )
    }
  ], [onDisableUser, onDeleteRole])
  const selectUser = useRef([]);
  const {
    state: addUserVisible,
    setTrue: openAddUser,
    setFalse: closeAddUser
  } = useBool();

  const {
    state: editUserVisible,
    setTrue: openEditUser,
    setFalse: closeEditUser
  } = useBool();
  return (
    <div>
      <div className="flex between items-center">
        <Form layout="inline">
          <Form.Item label="姓名" name="name" className="f-item">
            <Input placeholder="输入姓名查找" allowClear/>
          </Form.Item>
          <Form.Item label="账号" name="account" className="f-item">
            <Input placeholder="输入账号查找" allowClear/>
          </Form.Item>
          <Form.Item label="手机" name="phone" className="f-item">
            <Input placeholder="输入手机查找" allowClear/>
          </Form.Item>
          <Form.Item label="状态" name="enabled">
            <Select placeholder="账号状态" allowClear className="f-item">
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
          <Button icon={<SearchOutlined />} type="primary">搜索</Button>
        </Form>
        <Space>
          <Button type="primary" icon={<UserAddOutlined />} onClick={openAddUser}>添加用户</Button>
          <Button icon={<StopOutlined />}>批量禁用</Button>
          <Button icon={<DeleteOutlined />}>批量删除</Button>
        </Space>
      </div>
      <PageTable
        initGet
        getListFn={systemApi.getUserList}
        columns={userColumns}
        rowSelection={{
          fixed: true,
          columnWidth: 50,
          onChange: (keys, rows) => selectUser.current = rows
        }}
      />
      <UserModal title="添加用户" visible={addUserVisible} setHide={closeAddUser}/>
      <UserModal title="编辑用户" visible={editUserVisible} setHide={closeEditUser}/>
    </div>
  )
})

export default UserManage;