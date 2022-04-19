import React, { memo, useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import { useBool } from '@/hooks/base-hooks';
import PropTypes from 'prop-types';

const DictModal = memo(function ({
  dict,
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
  useEffect(() => {
    dictFormRef.setFieldsValue(dict);
  }, [dict])
  const [dictFormRef] = Form.useForm();
  function onOk() {
    const { validateFields, resetFields } = dictFormRef;
    validateFields().then(res => {
      startLoading();
      requestFn({
        ...res,
        id: dict.id
      }).then(res => {
        !dict && resetFields();
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
      <Form labelCol={{ span: 4 }} form={dictFormRef}>
        <Form.Item label="字典名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item label="字典编码" name="code" rules={[{ required: true, message: '请输入编码' }]}>
          <Input placeholder="请输入编码，需唯一" />
        </Form.Item>
        <Form.Item label="排序值" name="sort_val" rules={[{ required: true, message: '请输入排序值' }]}>
          <InputNumber placeholder="请输入排序值" className="w-full"/>
        </Form.Item>
        <Form.Item label="备注" name="remarks">
          <Input.TextArea placeholder="请输入备注" rows={4}/>
        </Form.Item>
      </Form>
    </Modal>
  )
})

DictModal.propTypes = {
  dict: PropTypes.object,
  requestFn: PropTypes.func.isRequired,
  setHide: PropTypes.func,
  onFinish: PropTypes.func
}

DictModal.defaultProps = {
  dict: {}
}

export default DictModal