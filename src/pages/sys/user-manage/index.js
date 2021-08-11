import React, { memo, useMemo, useCallback, useRef } from 'react';
import PageTable from '@/components/page-table';
import * as systemApi from '@/api/system';
import { 
  Button, Tag, Avatar, Form, 
  Input, Select, Space, message, 
  Modal, Menu, Dropdown 
} from 'antd';
import { 
  UserOutlined, SearchOutlined, UserAddOutlined, 
  StopOutlined, DeleteOutlined, CheckSquareOutlined, 
  DownOutlined 
} from '@ant-design/icons';
import { useBool } from '@/hooks/base-hooks';
import UserModal from './user-model';

const UserManage = memo(function () {
  const userList = useRef({});
  const [searchForm] = Form.useForm();
  const searchValues = useRef({});
  
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

  const getUserList = useCallback(() => {
    return systemApi.getUserList(searchValues.current);
  }, [])

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

  const toggleUserState = useCallback((users, enabled) => {
    operateBefore(users, {
      title: enabled ?  '确认启用以下用户？' : '确认禁用以下用户？',
      onOk: () => {
        systemApi.disableUser({
          enabled,
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
          {
            user.enabled ? 
            <Button size="small" type="link" onClick={() => toggleUserState([user], false)}>禁用</Button> :
            <Button size="small" type="link" onClick={() => toggleUserState([user], true)}>启用</Button>
          }
          <Button size="small" type="link" onClick={() => deleteUser([user])}>删除</Button>
        </>
      )
    }
  ], [toggleUserState, deleteUser])

  const handleBatchOperate = useCallback(({ key }) => {
    switch (key) {
      case '1':
        toggleUserState(selectUser.current, true)
        break;
      case '2':
        toggleUserState(selectUser.current, false)
        break;
      case '3':
        deleteUser(selectUser.current)
        break;
      default:
        break;
    }
  }, [])

  const batchOperateMenu = useMemo(() => {
    return (
      <Menu onClick={handleBatchOperate}>
        <Menu.Item key="1" icon={<CheckSquareOutlined />}>批量启用</Menu.Item>
        <Menu.Item key="2" icon={<StopOutlined />}>批量禁用</Menu.Item>
        <Menu.Item key="3" icon={<DeleteOutlined />}>批量删除</Menu.Item>
      </Menu>
    )
  }, [])


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
          <Dropdown overlay={batchOperateMenu}>
            <Button>批量操作<DownOutlined /></Button>
          </Dropdown>
          {/* <Button icon={<CheckSquareOutlined />} onClick={() => toggleUserState(selectUser.current, true)}>批量启用</Button>
          <Button icon={<StopOutlined />} onClick={() => toggleUserState(selectUser.current, false)}>批量禁用</Button>
          <Button icon={<DeleteOutlined />} onClick={() => deleteUser(selectUser.current)}>批量删除</Button> */}
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