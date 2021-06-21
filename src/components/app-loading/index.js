import React, { memo } from 'react';
import { Spin } from 'antd';
import { LoadingWrap } from './style';

export default memo(function Suspense() {
  return (
    <LoadingWrap>
      <Spin size="large"/>
    </LoadingWrap>
  )
})
