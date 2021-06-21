import React, { memo, useState } from 'react'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Tabs, Space, Input, Button, message } from 'antd';
import { useRequest } from 'ahooks';
import { LoginWrap } from './style';
import * as userApi from '@/api/user';
import AppFooter from 'components/app-footer';

export default memo(function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const { loading: loginLoading, run: login } = useRequest(loginRequest, {
    manual: true
  });

  function loginRequest() {
    return userApi.login({
      userName,
      password,
      $config: { 
        loadingConfig: '正在登录...', 
        successTipType: 'notify',
        successTipConfig: res => {
          return { message: '登录成功', description: res.msg }
        }
      }
    }).then(res => {
    })
  }

  return (
    <LoginWrap>
      <div className="main">
        <div className="top">
          <h1 className="title">LY Admin</h1>
          <p className="desc">著名前端工程师Li Yu倾力打造</p>
        </div>
        <Tabs centered>
          <Tabs.TabPane tab="账号密码登录" key="1">
            <Space direction="vertical" className="wrap" size="large">
              <Input
                size="large"
                placeholder="用户名"
                prefix={<UserOutlined className="inp-icon" />}
                allowClear
                className="f-item"
                onChange={e => setUserName(e.target.value)}
                onPressEnter={login}
              />
              <Input.Password 
                size="large" 
                placeholder="密码"
                prefix={<LockOutlined className="inp-icon" />} 
                className="f-item"
                onChange={e => setPassword(e.target.value)}
                onPressEnter={login}
              />
            </Space>
          </Tabs.TabPane>
          <Tabs.TabPane tab="手机号登录" key="2">

          </Tabs.TabPane>
        </Tabs>
        <Button 
          type="primary" 
          size="large" 
          block 
          className="login-btn" 
          onClick={login}
          loading={loginLoading}
        >
          登 录
        </Button>
      </div>
      <footer className="footer">
        <AppFooter/>
      </footer>
    </LoginWrap>
  )
})
