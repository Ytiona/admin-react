import React, { memo, useState, useReducer, useEffect, useImperativeHandle, forwardRef } from 'react'
import {
  Button, Form, Input,
  InputNumber, Switch,
  Radio, Row, Col, Popover,
  Tooltip, Modal
} from 'antd';
import {
  ApartmentOutlined, SmileOutlined
} from '@ant-design/icons';
import IconSelector from '@/components/icon-selector';
import MenuList from './menu-list';
import { useMenuList } from './hooks';

// 所有菜单列表（父级）
function AllMenuList({ onSelect }) {
  const { menuList } = useMenuList();
  return (
    <div style={{ height: '500px', overflow: 'auto', minWidth: '300px' }}>
      <MenuList
        showIcon
        showLine={{ showLeafIcon: false }}
        menuList={menuList}
        style={{ color: '#515a6e' }}
        onSelect={onSelect}
      />
    </div>
  )
}

// 表单数据相关
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
function nodeFormReducer(state, action) {
  const result = { ...state, ...action };
  return result;
}
function useNodeForm() {
  const [nodeForm, updateNodeForm] = useReducer(nodeFormReducer, initNodeForm);
  function updateFormByInp(event) {
    const { value, name } = event.target;
    updateNodeForm({ [name]: value })
  }
  return {
    nodeForm,
    updateNodeForm,
    updateFormByInp
  }
}

// 节点类型相关
function useNodeType({ updateFormByInp }) {
  const [nodeType, setNodeType] = useState('1');
  function renderByType(types, node) {
    if (Array.isArray(types)) {
      return types.includes(nodeType) ? node : null;
    }
    return types === nodeType ? node : null;
  }
  function onChangeNodeType(event) {
    setNodeType(event.target.value);
    updateFormByInp(event);
  }
  return {
    nodeType,
    renderByType,
    onChangeNodeType
  }
}

// 选择父节点相关
function useSelParent({ updateNodeForm }) {
  const [isShowSelParent, setIsShowSelParent] = useState(false);
  function onSelectParent(selKeys, { node }) {
    updateNodeForm({
      parent_id: node.id,
      parent_name: node.name,
      node_path: node.node_path
    })
    setIsShowSelParent(false);
  }
  return { isShowSelParent, setIsShowSelParent, onSelectParent }
}

function useIconSelector() {

}

const NodeForm = function NodeForm({ parentNode, node, isEdit }, ref) {
  const { nodeForm, updateNodeForm, updateFormByInp } = useNodeForm();
  const { renderByType, onChangeNodeType } = useNodeType({ updateFormByInp });
  const { isShowSelParent, setIsShowSelParent, onSelectParent } = useSelParent({ updateNodeForm });

  useEffect(() => {
    const { id, name } = parentNode || {};
    updateNodeForm({
      parent_id: id,
      parent_name: name
    })
  }, [parentNode, updateNodeForm])

  useEffect(() => {
    const _node = node || {};
    updateNodeForm({
      ..._node,
      icon: _node.iconName
    })
  }, [node, updateNodeForm])

  const [formRef] = Form.useForm();
  useEffect(() => {
    formRef.setFieldsValue(nodeForm);
  }, [nodeForm, formRef])

  useImperativeHandle(ref, () => ({
    nodeForm: nodeForm,
    validateForm: formRef.validateFields
  }))

  return (
    <>
      <Modal visible={true} width={1000} title="选择图标" footer={null}>
        <IconSelector />
      </Modal>
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
        {
          isEdit ?
            null :
            <Form.Item label="父级">
              <Row gutter={10}>
                <Col flex="1">
                  <Input
                    placeholder="请选择父级"
                    readOnly
                    name="parent_name"
                    onChange={updateFormByInp}
                    value={nodeForm.parent_name}
                  />
                </Col>
                <Col>
                  <Popover
                    placement="rightTop"
                    trigger="click"
                    autoAdjustOverflow={false}
                    visible={isShowSelParent}
                    content={<AllMenuList onSelect={onSelectParent} />}
                  >
                    <Button icon={<ApartmentOutlined />} onClick={() => setIsShowSelParent(!isShowSelParent)}>选择父级</Button>
                  </Popover>
                </Col>
              </Row>
            </Form.Item>
        }
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
          <Input placeholder="请输入节点名称" name="name" onChange={updateFormByInp} />
        </Form.Item>
        <Form.Item label="编码" name="code">
          <Input placeholder="请输入节点编码" name="code" onChange={updateFormByInp} />
        </Form.Item>
        <Form.Item label="图标" name="icon">
          <Row gutter={10}>
            <Col flex="1">
              <Input readOnly placeholder="请选择图标" name="icon" onChange={updateFormByInp} value={nodeForm.icon} />
            </Col>
            <Col><Button icon={<SmileOutlined />}>选择图标</Button></Col>
          </Row>

        </Form.Item>
        {
          renderByType(['0', '1'],

            <Form.Item label="路径" name="node_path" rules={[{ required: true, message: '请输入路径' }]}>
              <Tooltip placement="right" title="须唯一">
                <Input placeholder="请输入路径" name="node_path" onChange={updateFormByInp} value={nodeForm.node_path} />
              </Tooltip>
            </Form.Item>
          )
        }
        {
          renderByType('1',
            <Form.Item label="前端组件" name="component_path">
              <Input placeholder="请输入前端组件路径(不填则使用路径值)" name="component_path" onChange={updateFormByInp} />
            </Form.Item>
          )
        }
        {
          renderByType('2',
            <Form.Item label="接口地址" name="request_addr">
              <Input placeholder="请输入请求接口地址" name="request_addr" onChange={updateFormByInp} />
            </Form.Item>
          )
        }
        <Form.Item label="排序值" name="order_val">
          <InputNumber
            placeholder="请输入排序值"
            style={{ width: '100%' }}
            onChange={num => { updateNodeForm({ order_val: num }) }}
          />
        </Form.Item>
        <Form.Item label="说明" name="remarks">
          <Input.TextArea rows={4} placeholder="请输入说明" name="remarks" onChange={updateFormByInp} />
        </Form.Item>
        <Form.Item label="是否启用" name="enabled">
          <Switch
            checkedChildren="启用"
            unCheckedChildren="禁用"
            checked={nodeForm.enabled}
            onChange={checked => { updateNodeForm({ enabled: checked }) }}
          />
        </Form.Item>
      </Form>
    </>
  )
}

export default memo(forwardRef(NodeForm));