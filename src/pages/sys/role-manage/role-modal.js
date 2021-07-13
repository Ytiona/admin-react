import React, { memo, useRef } from 'react';
import { Modal } from 'antd';
import { useBool } from '@/hooks/base-hooks';
import RoleForm from './role-form';
import PropTypes from 'prop-types';

const RoleModal = function RoleModal({
  role,
  requestFn,
  setHide,
  onFinish,
  ...args
}) {
  const {
    state: loading,
    setFalse: stopLoading,
    setTrue: startLoading
  } = useBool(false);
  const roleFormRef = useRef();
  function onOk() {
    const { formRef } = roleFormRef.current;
    const { validateFields, resetFields } = formRef;
    validateFields().then(res => {
      startLoading();
      requestFn({
        ...res,
        id: role.id
      }).then(res => {
        resetFields();
        setHide();
        onFinish();
      }).finally(stopLoading)
    })
  }
  return (
    <Modal
      width={500}
      title="添加角色"
      confirmLoading={loading}
      onOk={onOk}
      onCancel={setHide}
      {...args}
    >
      <RoleForm ref={roleFormRef} role={role}/>
    </Modal>
  )
}

RoleModal.propTypes = {
  role: PropTypes.object,
  requestFn: PropTypes.func.isRequired,
  setHide: PropTypes.func,
  onFinish: PropTypes.func
}

RoleModal.defaultProps = {
  role: {}
}

export default memo(RoleModal);