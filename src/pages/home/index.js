import React, { memo } from 'react'
import { Layout, Menu } from 'antd';
import { LayoutWrap } from './style';
import AppFooter from 'components/app-footer';

const { Header, Content, Footer, Sider } = Layout;

export default memo(function Home() {
  return (
    <LayoutWrap>
      <Layout className="layout">
        <Sider className="sider">
          <div className="logo">
            <h1>LY Admin</h1>
          </div>
          <Menu theme="dark" mode="inline">
            
          </Menu>
        </Sider>
        <Layout className="main">
          <Header className="header"></Header>
          <Content className="content">

          </Content>
          <Footer className="footer">
            <AppFooter/>
          </Footer>
        </Layout>
      </Layout>
    </LayoutWrap>
  )
})
