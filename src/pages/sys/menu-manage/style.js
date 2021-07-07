import styled from 'styled-components';
import { gray } from '@/common/js/colors';

export const StyleWrap = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  .main {
    flex: 1;
    margin-top: 20px;
    display: flex;
    .main-tree {
      min-width: 360px;
      min-height: 100%;
      margin-right: 20px;
      padding-right: 20px;
      border-right: 1px solid ${gray[1]};
    }
    .main-detail {
      min-width: 520px;
    }
  }
`;