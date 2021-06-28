import React, { memo, useState, useReducer, useCallback, useEffect, useImperativeHandle } from 'react'
import {
  Button, Form,
  Input, InputNumber, Switch,
  Radio, Row, Col
} from 'antd';
import { ApartmentOutlined, SmileOutlined } from '@ant-design/icons';

const typeOptions = [
  { label: '栏目', value: '0' },
  { label: '菜单', value: '1' },
  { label: '权限项', value: '2' },
]

const initNodeForm = {
  parent_id: '11',
  type: '1',
  name: '好借好还和',
  code: '123',
  icon: '123',
  icon_type: '23132',
  node_path: '12323',
  component_path: '312332',
  order_val: 1120,
  remarks: '123213',
  enabled: true,
  request_addr: '12323'
}

function nodeFormReducer (state, action) {
  const result = Object.assign(state, action);
  console.log(result)
  return result;
}

export default memo(function NodeForm(props) {
  console.log(props);
  const [nodeType, setNodeType] = useState('1');
  function renderByType(types, node) {
    if (Array.isArray(types)) {
      return types.includes(nodeType) ? node : null;
    }
    return types === nodeType ? node : null;
  }
  function onChangeNodeType(event) {
    setNodeType(event.target.value);
    updateForm(event);
  }
  const [nodeForm, updateNodeForm] = useReducer(nodeFormReducer, initNodeForm);

  const updateForm = useCallback(
    (event) => {
      const { value, name } = event.target;
      updateNodeForm({ [name]: value })
    },
    [],
  )
  
  useImperativeHandle(props.ref, () => {
    return {
      nodeForm
    }
  })

  const [formRef] = Form.useForm();
  useEffect(() => {
    console.log(nodeForm);
    formRef.setFieldsValue(nodeForm);
  }, [nodeForm])

  return (
    <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} form={formRef}>
      <Form.Item label="类型" name="type">
        <Radio.Group
          options={typeOptions}
          optionType="button"
          buttonStyle="solid"
          name="type"
          onChange={onChangeNodeType}
        />
      </Form.Item>
      <Form.Item label="父级" name="parent_id">
        <Row gutter={10}>
          <Col flex="1">
            <Input placeholder="请选择父级" name="parent_id" onChange={updateForm} value={nodeForm.parent_id} />
          </Col>
          <Col><Button icon={<ApartmentOutlined />}>选择父级</Button></Col>
        </Row>
      </Form.Item>
      <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
        <Input placeholder="请输入节点名称" name="name" onChange={updateForm} />
      </Form.Item>
      <Form.Item label="编码" name="code">
        <Input placeholder="请输入节点编码" name="code" onChange={updateForm} />
      </Form.Item>
      <Form.Item label="图标" name="icon">
        <Row gutter={10}>
          <Col flex="1">
            <Input readOnly placeholder="请选择图标" name="icon" onChange={updateForm} value={nodeForm.icon} />
          </Col>
          <Col><Button icon={<SmileOutlined />}>选择图标</Button></Col>
        </Row>
      </Form.Item>
      {
        renderByType(['0', '1'],
          <Form.Item label="路径" name="node_path" rules={[{ required: true, message: '请输入路径' }]}>
            <Input placeholder="请输入路径" name="node_path" onChange={updateForm} />
          </Form.Item>
        )
      }
      {
        renderByType('1',
          <Form.Item label="前端组件" name="component_path" rules={[{ required: true, message: '请输入前端组件路径' }]}>
            <Input placeholder="请输入前端组件路径" name="component_path" onChange={updateForm} />
          </Form.Item>
        )
      }
      {
        renderByType('2',
          <Form.Item label="接口地址" name="request_addr">
            <Input placeholder="请输入请求接口地址" name="request_addr" onChange={updateForm} />
          </Form.Item>
        )
      }
      <Form.Item label="排序值" name="order_val">
        <InputNumber 
          placeholder="请输入排序值" 
          style={{ width: '100%' }}
          onChange={num => { updateForm({ target: { name: "order_val", value: num } }) }} 
        />
      </Form.Item>
      <Form.Item label="说明" name="remarks">
        <Input.TextArea rows={4} placeholder="请输入说明" name="remarks" onChange={updateForm} />
      </Form.Item>
      <Form.Item label="是否启用" name="enabled">
        <Switch 
          checkedChildren="启用" 
          unCheckedChildren="禁用"
          checked={nodeForm.enabled}
          onChange={checked => { updateForm({ target: { name: "enabled", value: checked } }) }} 
        />
      </Form.Item>
    </Form>
  )
})
