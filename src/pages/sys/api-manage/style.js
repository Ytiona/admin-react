import styled from 'styled-components';
import { gray } from '@/common/js/colors';

export const ApiManageWrap = styled.div`
  display: flex;
  align-items: flex-start;
  .nav {
    width: 300px;
    border: 1px solid ${gray[1]};
    /* box-shadow: 0 1px 4px rgb(0 21 41 / 8%); */
    border-radius: 4px;
    .ant-menu-submenu-title {
      font-size: 14px;
      font-weight: bold;
    }
  }
  .api-list {
    flex: 1;
    overflow: auto;
    max-height: calc(100vh - 62px - 50px - 62px);
    .item {
      padding: 30px 0;
      margin: 0 30px;
      .top {
        display: flex;
        align-items: flex-end;
        margin-bottom: 10px;
        .name {
          line-height: 1;
          margin-right: 10px;
          font-size: 18px;
        }
        .desc {
          line-height: 1;
          font-size: 12px;
          color: ${gray[2]};
        }
      }
      .api {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        .addr {
          font-size: 14px;
          color: ${gray[3]};
        }
        .copy-btn {
          padding: 4px;
          font-size: 12px;
          cursor: pointer;
        }
      }
      .auth-switch {
        min-width: 80px;
        margin-left: 10px;
      }
      .table-head {
        display: flex;
        align-items: center;
        &::before {
          content: '';
          display: inline-block;
          margin-right: 6px;
          width: 8px;
          height: 8px;
          border: 2px solid;
          border-radius: 50%;
        }
        &.params::before {
          border-color: #2db7f5;
        }
        &.response::before {
          border-color: #87d068;
        }
      }
    }
  }
`;