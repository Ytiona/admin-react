import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { Menu, Avatar, Dropdown } from 'antd';

export default memo(function HeaderContent() {
  const { userInfo } = useSelector(state => ({
    userInfo: state.getIn(['user', 'userInfo'])
  }))
  const dispatch = useDispatch();
  const history = useHistory();
  function onClickUserDrop({ key }) {
    switch (key) {
      case '3':
        dispatch({ type: 'logout' });
        history.push('/login');
        break;
      default:
        break;
    }
  }
  return (
    <Dropdown
      className="user-drop"
      overlay={
        <Menu onClick={onClickUserDrop}>
          <Menu.Item key="0" icon={<UserOutlined />}>
            个人中心
          </Menu.Item>
          <Menu.Item key="1" icon={<SettingOutlined />}>
            个人设置
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="3" icon={<LogoutOutlined />}>
            退出登录
          </Menu.Item>
        </Menu>
      }
    >
      <div className="user">
        <Avatar size={30} icon={<UserOutlined />} />
        <span className="user-name">{ userInfo.name || userInfo.account }</span>
      </div>
    </Dropdown>
  )
})
