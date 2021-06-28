import React, { memo } from 'react';
import { CopyrightOutlined } from '@ant-design/icons';
import { FooterWrap } from './style';

export default memo(function AppFooter() {
  return (
    <FooterWrap>
      <span className="icon">
        <CopyrightOutlined />
      </span>
      Li Yu
    </FooterWrap>
  )
})
