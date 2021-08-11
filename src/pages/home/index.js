import React, { memo, Suspense } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Layout, Menu, Card } from 'antd';
import Icon from '@/components/icon';
import { LayoutWrap } from './style';
import AppFooter from '@/components/app-footer';
import AppLoading from '@/components/app-loading';
import useUserMenus from '@/hooks/use-user-menus';
import HeaderContent from './header-content';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default memo(function Home({ location }) {
  const { token, menuList, Routes } = useUserMenus();
  return (
    <>
      {
        token ?
          <LayoutWrap>
            <Layout className="layout">
              <Sider className="sider">
                <div className="logo">
                  <img src={require("@/assets/img/logo.svg").default} alt="" />
                  <span className="txt">Yzm Admin</span>
                </div>
                <Menu
                  theme="dark"
                  mode="inline"
                  defaultSelectedKeys={[location.pathname]}
                >{generateMenu(menuList)}</Menu>
              </Sider>
              <Layout className="uber-main">
                <Header className="header">
                  <HeaderContent />
                </Header>
                <div className="scroll-wrap">
                  <Content className="uber-container">
                    <Card className="uber-content">
                      {
                        <Suspense fallback={<AppLoading />}>
                          {
                            Routes
                          }
                        </Suspense>
                      }
                    </Card>
                  </Content>
                  <Footer className="footer">
                    <AppFooter />
                  </Footer>
                </div>
              </Layout>
            </Layout>
          </LayoutWrap> :
          <Redirect to="/login" />
      }
    </>
  )
})

function generateMenu(menuList) {
  return menuList.map(item => {
    if (item.type === '0') {
      return <SubMenu
        key={item.path}
        icon={<Icon name={item.icon} className="menu-icon" />}
        title={item.name}
      >
        {item.children && item.children.length > 0 ? generateMenu(item.children) : null}
      </SubMenu>
    }
    return <Menu.Item
      key={item.path}
      icon={<Icon name={item.icon} className="menu-icon" />}
    >
      <Link to={item.path} replace>{item.name}</Link>
    </Menu.Item>;
  })
}
