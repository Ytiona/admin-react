import styled from 'styled-components';

export const LayoutWrap = styled.div`
  min-height: 100%;
  .layout {
    min-height: 100%;
  }
  .sider {
    position: fixed;
    left: 0;
    height: 100vh;
    overflow: auto;
  }
  .main {
    min-height: 100vh;
    margin-left: 200px;
  }
  .logo {
    padding: 14px 0;
    text-align: center;
    h1 {
      font-weight: bold;
      font-size: 24px;
      color: #fff;
    }
  }
  .header {
    position: fixed;
    width: 100%;
    z-index: 1;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    background-color: #fff;
  }
  .content {
    height: 2000px;
    margin: 14px;
    margin-top: 78px;
    background-color: #fff;
  }
`