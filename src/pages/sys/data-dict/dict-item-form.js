import React, { memo } from 'react';
import { Form, Input, InputNumber, Switch } from 'antd';

const DictItemForm = memo(function ({
  form
}) {
  return (
    <Form form={form} labelCol={{ span: 4 }} initialValues={{ enabled: true }}>
      <Form.Item label="数据名" name="name" rules={[{ required: true, message: '请输入数据名' }]}>
        <Input placeholder="请输入数据名" />
      </Form.Item>
      <Form.Item label="数据值" name="value" rules={[{ required: true, message: '请输入数据值' }]}>
        <Input placeholder="请输入数据值" />
      </Form.Item>
      <Form.Item label="排序值" name="sort_val" rules={[{ required: true, message: '请输入排序值' }]}>
        <InputNumber placeholder="请输入排序值" className="w-full"/>
      </Form.Item>
      <Form.Item label="状态" name="enabled">
        <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked/>
      </Form.Item>
      <Form.Item label="备注" name="remarks">
        <Input.TextArea placeholder="请输入备注" rows={4}/>
      </Form.Item>
    </Form>
  )
})

export default DictItemForm