import React, { memo, useMemo, useCallback, useRef } from 'react';
import PageTable from '@/components/page-table';
import * as systemApi from '@/api/system';
import { Button, Tag, Avatar, Form, Input, Select, Space, message, Modal } from 'antd';
import { UserOutlined, SearchOutlined, UserAddOutlined, StopOutlined, DeleteOutlined } from '@ant-design/icons';
import { useBool } from '@/hooks/base-hooks';
import UserModal from './user-model';

const UserManage = memo(function () {
  const userList = useRef({});
  const [searchForm] = Form.useForm();
  const searchValues = useRef({});

  const onDisableUser = useCallback(() => {

  }, [])
  const onDeleteRole = useCallback(() => {
    
  }, [])
  
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

  const getUserList = () => {
    return systemApi.getUserList(searchValues.current);
  }

  const search = () => {
    const { getFieldsValue } = searchForm;
    searchValues.current = getFieldsValue(true);
    userList.current.getList(true);
  }

  
  const operateBefore = (users, options) => {
    if(!window.notEmptyArray(users)) return message.warning('请选择');
    Modal.confirm({
      content: <ul>
        {
          users.map(user => (
            <li key={user.id}>
              {user.account}
              <span className="min-desc"> - {user.name} </span>
            </li>
          ))
        }
      </ul>,
      ...options
    })
  }

  const deleteUser = useCallback((users) => {
    operateBefore(users, {
      title: '确认删除以下用户？',
      onOk: () => {
        systemApi.deleteUser({
          userIds: users.map(item => item.id)
        }).then(userList.current.getList)
      }
    })
  }, [systemApi.deleteUser])

  const disableUser = useCallback((users) => {
    operateBefore(users, {
      title: '确认禁用以下用户？',
      onOk: () => {
        systemApi.disableUser({
          userIds: users.map(item => item.id)
        }).then(userList.current.getList)
      }
    })
  }, [systemApi.deleteUser])
  
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
      render: (text, user) => (
        <>
          <Button size="small" type="link" onClick={openEditUser}>编辑</Button>
          <Button size="small" type="link" onClick={() => disableUser([user])}>禁用</Button>
          <Button size="small" type="link" onClick={() => deleteUser([user])}>删除</Button>
        </>
      )
    }
  ], [disableUser, deleteUser])

  return (
    <div>
      <div className="flex between items-center">
        <Form layout="inline" form={searchForm}>
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
          <Button icon={<SearchOutlined />} type="primary" onClick={search}>搜索</Button>
        </Form>
        <Space>
          <Button type="primary" icon={<UserAddOutlined />} onClick={openAddUser}>添加用户</Button>
          <Button icon={<StopOutlined />} onClick={() => disableUser(selectUser.current)}>批量禁用</Button>
          <Button icon={<DeleteOutlined />} onClick={() => deleteUser(selectUser.current)}>批量删除</Button>
        </Space>
      </div>
      <PageTable
        initGet
        getListFn={getUserList}
        columns={userColumns}
        rowSelection={{
          fixed: true,
          columnWidth: 50,
          onChange: (keys, rows) => selectUser.current = rows
        }}
        ref={userList}
      />
      <UserModal 
        title="添加用户" 
        visible={addUserVisible} 
        setHide={closeAddUser} 
        requestFn={systemApi.createUser}
        onFinish={userList.current.getList}
      />
      <UserModal 
        isEdit
        title="编辑用户" 
        visible={editUserVisible} 
        setHide={closeEditUser} 
        requestFn={systemApi.updateUser}
        onFinish={userList.current.getList} 
      />
    </div>
  )
})

export default UserManage;