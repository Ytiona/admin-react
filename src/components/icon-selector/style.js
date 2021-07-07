import styled from 'styled-components';
import { gray } from '@/common/js/colors';

export const IconSelectorWrap = styled.div`
.search-box {
  width: 50%;
  margin: 10px auto;
  .search-inp {
    padding: 8px 10px;
    background: ${gray[0]};
    input {
      text-align: center;
    }
    .suffix {
      color: ${gray[2]};
    }
  }
}
.antds {
  display: flex;
  flex-wrap: wrap;
  max-height: 500px;
  overflow: auto;
  .icon-item {
    width: 150px;
    padding: 10px;
    text-align: center;
    opacity: 0.7;
    cursor: pointer;
    transition: .3s;
    &:hover {
      opacity: 1;
      transform: scale(1.2);
    }
    .icon {
      font-size: 32px;
    }
    .name {
      margin-top: 4px;
      font-size: 12px;
      color: ${gray[3]};
    }
  }
}
`;