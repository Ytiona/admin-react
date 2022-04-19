import React, { memo, useEffect } from 'react';
import { Modal, Form } from 'antd';
import { useBool } from '@/hooks/base-hooks';
import PropTypes from 'prop-types';

const AoeModal = function AoeModal({
  idField = 'id',
  width = 500,
  title,
  editData,
  request,
  params,
  setHide,
  onFinish,
  children,
  ...args
}) {
  const {
    state: loading,
    setFalse: stopLoading,
    setTrue: startLoading
  } = useBool(false);
  const [formInstance] = Form.useForm();
  useEffect(() => {
    formInstance.setFieldsValue(editData);
  }, [editData])
  function onOk() {
    const { validateFields, resetFields } = formInstance;
    validateFields().then(res => {
      startLoading();
      request({
        ...res,
        ...params,
        id: editData ? editData[idField] : undefined
      }).then(res => {
        if(!editData) {
          resetFields();
        }
        setHide();
        onFinish();
      }).finally(stopLoading)
    })
  }
  return (
    <Modal
      title={title || (editData ? '编辑' : '添加')}
      width={width}
      confirmLoading={loading}
      onOk={onOk}
      onCancel={setHide}
      {...args}
    >
      {React.cloneElement(children, { editData, form: formInstance })}
    </Modal>
  )
}

AoeModal.propTypes = {
  editData: PropTypes.object,
  request: PropTypes.func.isRequired,
  setHide: PropTypes.func,
  onFinish: PropTypes.func
}

AoeModal.defaultProps = {
  editData: {}
}

export default memo(AoeModal);