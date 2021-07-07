import React, { memo } from 'react';
import PropTypes from 'prop-types';
import * as AntdIcons from '@ant-design/icons';

const Icon = memo(function ({ name, ...props }) {
  return(
    <>
      {
        AntdIcons[name] ?
        React.createElement(AntdIcons[name], props)
        : null
      }
    </>
  )
})

Icon.propTypes = {
  name: PropTypes.string.isRequired
}

Icon.defaultProps = {
  name: ''
}

export default Icon;
