import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Icon from '@/components/icon';

 const TypeIcon = memo(function TypeIcon({ name, type, ...props }) {
  return (
    <>
      <Icon name={name} {...props}/>
    </>
  )
})

TypeIcon.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
}

TypeIcon.defaultProps = {
  name: '',
  type: '0'
}

export default TypeIcon;