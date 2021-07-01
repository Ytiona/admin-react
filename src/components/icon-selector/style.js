import styled from 'styled-components';

export const IconSelectorWrap = styled.div`
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
        color: #454545;
      }
    }
  }
`;