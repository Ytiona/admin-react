import React, { memo, useState, useReducer, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react'
import {
  Button, Form,
  Input, InputNumber, Switch,
  Radio, Row, Col,
  Tree, Popover
} from 'antd';
import { 
  ApartmentOutlined, SmileOutlined, 
  FolderOpenOutlined, FileOutlined,
  GoldOutlined
} from '@ant-design/icons';
import * as systemApi from '@/api/system';
import { treeIterator } from '@/utils/tree';

const typeOptions = [
  { label: '栏目', value: '0' },
  { label: '菜单', value: '1' },
  { label: '权限项', value: '2' },
]

const initNodeForm = {
  parent_id: '',
  parent_name: '',
  type: '1',
  name: '',
  code: '',
  icon: '',
  icon_type: '0',
  node_path: '',
  component_path: '',
  order_val: null,
  remarks: '',
  enabled: true,
  request_addr: ''
}

const treeIconMap = {
  0: <FolderOpenOutlined />,
  1: <FileOutlined />,
  2: <GoldOutlined />
}

function nodeFormReducer (state, action) {
  const result = Object.assign(state, action);
  // console.log(result);
  return result;
}

function MenuList({ onSelect }) {
  const [menuList, setMenuList] = useState();
  useEffect(() => {
    systemApi.getMenuList().then(res => {
      setMenuList(treeIterator(
        res.result || [], 
        item => {
          item.title = item.name;
          item.key = item.id;
          item.icon = treeIconMap[item.type];
        }
      ))
    })
  }, [])
  return (
    <div style={{ height: '500px', overflow: 'auto', minWidth: '300px' }}>
      <Tree
        showIcon
        showLine={{showLeafIcon: false}}
        treeData={menuList}
        style={{ color: '#515a6e' }}
        onSelect={onSelect}
      />
    </div>
  )
}

const NodeForm = function NodeForm({ parentId }, ref) {
  

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
    []
  )
  
  useEffect(() => {
    updateForm({ target: { name: 'parent_id', value: parentId } })
  }, [parentId])

  const [formRef] = Form.useForm();
  useEffect(() => {
    formRef.setFieldsValue(nodeForm);
  }, [nodeForm, formRef])

  const [isShowSelParent, setIsShowSelParent] = useState(false);
  function onSelectParent(selKeys, { node }) {
    updateForm({
      target: { value: node.id, name: 'parent_id' }
    })
    updateForm({
      target: { value: node.name, name: 'parent_name' }
    })
    setIsShowSelParent(false);
  }

  useImperativeHandle(ref, () => ({
    nodeForm: nodeForm,
    validateForm: formRef.validateFields
  }))
  
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
      <Form.Item label="父级">
        <Row gutter={10}>
          <Col flex="1">
            <Input placeholder="请选择父级" name="parent_name" onChange={updateForm} value={nodeForm.parent_name} />
          </Col>
          <Col>
            <Popover 
              placement="rightTop" 
              trigger="click" 
              autoAdjustOverflow={false}
              visible={isShowSelParent} 
              content={
                <MenuList onSelect={onSelectParent}/>
              }
            >
              <Button icon={<ApartmentOutlined />} onClick={() => setIsShowSelParent(!isShowSelParent)}>选择父级</Button>
            </Popover>
          </Col>
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
          <Form.Item label="前端组件" name="component_path">
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
}

export default memo(forwardRef(NodeForm));