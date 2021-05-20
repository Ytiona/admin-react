import React, { memo, useState } from 'react'
import { CopyrightOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { Tabs, Space, Input, Button, message } from 'antd';
import axios from 'axios';
import { LoginWrap } from './style';
import * as userApi from '@/api/user';

const { TabPane } = Tabs;

function useRequest(fn) {
  const [loading, setLoading] = useState(false);
  function run() {
    setLoading(true);
    fn().finally(() => {
      setLoading(false);
    })
  }
  return [loading, run, setLoading];
}

export default memo(function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, login] = useRequest(loginRequest);
  function loginRequest() {
    return axios.post('http://192.168.0.101:3001/user/login', {
      userName,
      password
    }).then(res => {
      const data = res.data;
      if(data.code === 0) {
        message.success(data.msg);
      } else {
        message.error(data.msg);
      }
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
          <TabPane tab="账号密码登录" key="1">
            <Space direction="vertical" className="wrap" size="large">
              <Input
                size="large"
                placeholder="用户名"
                prefix={<UserOutlined className="inp-icon" />}
                allowClear
                className="f-item"
                onChange={e => setUserName(e.target.value)}
              />
              <Input.Password 
                size="large" 
                placeholder="密码"
                prefix={<LockOutlined className="inp-icon" />} 
                className="f-item"
                onChange={e => setPassword(e.target.value)}
              />
            </Space>
          </TabPane>
          <TabPane tab="手机号登录" key="2">

          </TabPane>
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
        <span className="icon">
          <CopyrightOutlined />
        </span>
        Li Yu
      </footer>
    </LoginWrap>
  )
})
