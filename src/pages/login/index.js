import React, { memo, useRef, useState } from 'react'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Tabs, Space, Input, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { LoginWrap } from './style';
import * as userApi from '@/api/user';
import AppFooter from '@/components/app-footer';

export default memo(function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const account = useRef('');
  const password = useRef('');
  const [loginLoading, setLoginLoading] = useState(false);
  function login() {
    setLoginLoading(true);
    userApi.login({
      account: account.current,
      password: password.current,
      $config: { 
        loadingConfig: '正在登录...', 
        successTipType: 'notify',
        successTipConfig: res => {
          return { message: '登录成功', description: res.msg }
        }
      }
    }).then(res => {
      dispatch({ type: 'setToken', data: res.result});
      dispatch({ type: 'setUserInfo', data: res.userInfo});
      history.push('/home');
    }).finally(() => {
      setLoginLoading(false);
    })
  }

  return (
    <LoginWrap>
      <div className="main">
        <div className="top">
          <div className="logo">
            <img src={require("@/assets/img/logo.svg").default} alt="" height={48}/>
            <span className="txt">Yzm Admin</span>
          </div>
          <p className="desc">著名前端工程师Li Yu倾力打造</p>
        </div>
        <Tabs centered>
          <Tabs.TabPane tab="账号密码登录" key="1">
            <Space direction="vertical" className="wrap" size="large">
              <Input
                size="large"
                placeholder="账号"
                prefix={<UserOutlined className="inp-icon" />}
                allowClear
                className="inp"
                onChange={e => account.current = e.target.value}
                onPressEnter={login}
              />
              <Input.Password 
                size="large" 
                placeholder="密码"
                prefix={<LockOutlined className="inp-icon" />} 
                className="inp"
                onChange={e => password.current = e.target.value}
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
