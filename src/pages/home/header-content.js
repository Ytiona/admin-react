import React, { memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { UserOutlined, SettingOutlined, LogoutOutlined, CompressOutlined, ExpandOutlined } from '@ant-design/icons';
import { Layout, Menu, Avatar, Dropdown } from 'antd';

const { Header } = Layout;

function launchFullscreen() {
  const documentElement = document.documentElement;
  if (documentElement.requestFullscreen) {
    documentElement.requestFullscreen();
  } else if (documentElement.mozRequestFullScreen) {
    documentElement.mozRequestFullScreen();
  } else if (documentElement.webkitRequestFullscreen) {
    documentElement.webkitRequestFullscreen();
  } else if (documentElement.msRequestFullscreen) {
    documentElement.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

export default memo(function HeaderContent() {
  const [fullScreen, setFullScreen] = useState(false);
  const toggleFullScreen = () => {
    fullScreen ?
      exitFullscreen() :
      launchFullscreen()
    setFullScreen(!fullScreen);
  }
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
    <Header className="header">
      <div>

      </div>
      <div className="flex items-center mr-10">
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
            <span className="user-name">{userInfo.name || userInfo.account}</span>
          </div>
        </Dropdown>
        {
          fullScreen ?
            <CompressOutlined onClick={toggleFullScreen} /> :
            <ExpandOutlined onClick={toggleFullScreen} />
        }
      </div>
    </Header>
  )
})
