import styled from 'styled-components';
import { grey, blue } from '@ant-design/colors';

export const LoginWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f0f2f5;
  background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
  .main {
    flex: 1;
    margin: 20px auto;
    margin-top: 80px;
    width: 320px;
    .top {
      text-align: center;
      margin-bottom: 30px;
      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        .txt {
          margin-left: 10px;
          font-size: 28px;
          font-weight: bold;
          color: #000;
        }
      }
      .desc {
        color: ${grey[2]}
      }
    }
    .wrap {
      width: 100%;
      .f-item {
        width: 100%;
        .inp-icon {
          font-size: 14px;
          color: ${blue.primary}
        }
      }
    }
    .login-btn {
      margin-top: 30px;
    }
  }
`;