import React, { memo, useEffect, useState, Suspense } from 'react'
import { Redirect, Route, Link } from 'react-router-dom';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { Layout, Menu } from 'antd';
import Icon from '@/components/icon';
import { LayoutWrap } from './style';
import * as userApi from '@/api/user';
import AppFooter from 'components/app-footer';
import AppLoading from 'components/app-loading';
import { isEmpty } from '@/utils/helpers';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default memo(function Home({ location }) {
  const { token, menuList } = useSelector(state => ({
    token: state.getIn(['user', 'token']),
    menuList: state.getIn(['user', 'menuList'])
  }), shallowEqual)
  const isLogined = !isEmpty(token);
  const dispatch = useDispatch();
  const [routes, setRoutes] = useState([]);
  useEffect(() => {
    if (!isLogined) return;
    userApi.getMenuList().then(res => {
      const data = res.result || {};
      const routes = data.routes || [];
      const result = routes.map(item => {
        return <Route
          exact
          key={item.node_path}
          path={item.node_path}
          component={React.lazy(() => import(`@/pages${item.component_path || item.node_path}`))}
        />
      })
      setRoutes(result);
      dispatch({ type: 'setMenuList', data: data.menuTree });
    })
  }, [dispatch, isLogined])
  return (
    <>
      {
        isLogined ?
          <LayoutWrap>
            <Layout className="layout">
              <Sider className="sider">
                <div className="logo">
                  <h1>LY Admin</h1>
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]}>{generateMenu(menuList)}</Menu>
              </Sider>
              <Layout className="uber-main">
                <Header className="header"></Header>
                <Content className="uber-content">
                  {
                    <Suspense fallback={<AppLoading/>}>
                      { routes }
                    </Suspense>
                  }
                </Content>
                <Footer className="footer">
                  <AppFooter />
                </Footer>
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
        key={item.node_path} 
        icon={<Icon name={item.icon} className="menu-icon"/>} 
        title={item.name}
      >
        {item.children && item.children.length > 0 ? generateMenu(item.children) : null}
      </SubMenu>
    }
    return <Menu.Item 
      key={item.node_path} 
      icon={<Icon name={item.icon} className="menu-icon"/>}
    >
      <Link to={item.node_path}>{item.name}</Link>
    </Menu.Item>;
  })
}
