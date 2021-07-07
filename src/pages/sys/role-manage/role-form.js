import React, { memo } from 'react';
import { Form, Input, InputNumber } from 'antd';

export default memo(function RoleForm() {
  return (
    <Form labelCol={{ span: 5 }}>
      <Form.Item label="角色名称" name="role_name" rules={[{ required: true, message: "角色名称不能为空" }]}>
        <Input placeholder="请输入角色名称"/>
      </Form.Item>
      <Form.Item label="角色名称" name="role_code" rules={[{ required: true, message: "角色编码不能为空" }]}>
        <Input placeholder="请输入角色编码"/>
      </Form.Item>
      <Form.Item label="角色级别" name="role_level" rules={[{ required: true, message: "角色级别不能为空" }]}>
        <InputNumber className="w-full" placeholder="请输入角色级别，不大于自身级别"/>
      </Form.Item>
      <Form.Item label="备注" name="remarks">
        <Input.TextArea placeholder="请输入备注" rows={4}/>
      </Form.Item>
    </Form>
  )
})
