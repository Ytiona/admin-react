import React, { memo } from 'react'
import * as AntdIcon from '@ant-design/icons';

export default memo(function Icon({ name, ...props }) {
  return React.createElement(AntdIcon[name])
})