import styled from 'styled-components';

export const LayoutWrap = styled.div`
  .layout {
    display: flex;
  }
  .sider {
    height: 100vh;
    overflow: auto;
    .menu-icon {
      font-size: 12px;
    }
    .logo {
      padding: 20px 20px;
      display: flex;
      align-items: center;
      img {
        height: 36px;
      }
      .txt {
        margin-left: 10px;
        font-size: 20px;
        color: #fff;
        font-weight: bold;
      }
    }
  }
  .uber-main {
    flex: 1;
    min-height: 100vh;
    .header {
      padding: 0 14px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      line-height: normal;
      z-index: 1;
      box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
      background-color: #fff;
      .user-drop {
        min-width: 160px;
        justify-content: flex-end;
        padding-right: 10px;
      }
      .user {
        display: flex;
        align-items: center;
        margin-right: 10px;
        cursor: pointer;
        .user-name {
          margin-left: 5px;
        }
      }
    }
    .uber-container {
      margin: 14px 14px 0 14px;
      .uber-content {
        overflow: auto;
      }
    }
    .footer {
      padding: 0;
    }
  }
`