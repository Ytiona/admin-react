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
    .menu-icon {
      font-size: 10px;
    }
  }
  .uber-main {
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
    height: 48px;
    z-index: 1;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    background-color: #fff;
  }
  .uber-container {
    margin: 62px 14px 0 14px;
    .uber-content {
      overflow: auto;
    }
  }
  .footer {
    padding: 0;
  }
`