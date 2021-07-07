import React, { memo, useState, useRef } from 'react';
import {
  Button, Space,
  Modal, Row,
  message
} from 'antd';
import {
  PlusOutlined, DeleteOutlined,
  EditOutlined, RedoOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import * as systemApi from '@/api/system';
import { StyleWrap } from './style';
import MenuList from './menu-list';
import NodeForm from './node-form';
import { useMenuList } from './hooks';
import useUserMenus from '@/hooks/use-user-menus';

function useAddNode({ getMenuList }) {
  const addNodeRef = useRef();
  const [parentNode, setParentNode] = useState();
  const [selectedNode, setSelectedNode] = useState({});
  const [isShowAddNode, setIsShowAddNode] = useState(false);
  function handleAddChildNode() {
    setParentNode(selectedNode);
    setIsShowAddNode(true);
  }
  function handleAddTopNode() {
    setParentNode();
    setIsShowAddNode(true);
  }
  function closeAddNodeModal() {
    const { setIsShowSelParent } = addNodeRef.current;
    setIsShowAddNode(false);
    setIsShowSelParent(false);
  }

  function handleAddNode() {
    const { nodeForm, validateForm } = addNodeRef.current;
    validateForm().then(res => {
      systemApi.addNode(nodeForm).then(res => {
        getMenuList();
        closeAddNodeModal();
      })
    })
  }
  return {
    addNodeRef,
    parentNode,
    setParentNode,
    isShowAddNode,
    setIsShowAddNode,
    handleAddChildNode,
    handleAddTopNode,
    handleAddNode,
    selectedNode,
    setSelectedNode,
    closeAddNodeModal
  }
}

function useUpdateNode({ getMenuList }) {
  const updateNodeRef = useRef();
  const [updateNodeLoading, setUpdateNodeLoading] = useState(false);
  function onUpdateNode() {
    const { nodeForm, validateForm } = updateNodeRef.current;
    if(window.isEmpty(nodeForm.id)) return message.error('请选择节点');
    validateForm().then(res => {
      Modal.confirm({
        title: '温馨提示',
        content: '确定更新该节点？',
        onOk() {
          setUpdateNodeLoading(true);
          systemApi.updateNode(nodeForm).then(res => {
            getMenuList();
          }).finally(() => {
            setUpdateNodeLoading(false);
          })
        }
      })
    })
  }
  return {
    updateNodeRef,
    updateNodeLoading,
    onUpdateNode
  }
}

export default memo(function MenuManage() {
  const { menuList, getMenuList } = useMenuList();
  const checkedMenus = useRef();

  const {
    addNodeRef,
    parentNode,
    isShowAddNode,
    handleAddChildNode,
    handleAddTopNode,
    handleAddNode,
    selectedNode,
    setSelectedNode,
    closeAddNodeModal
  } = useAddNode({ getMenuList });

  const {
    updateNodeRef,
    updateNodeLoading,
    onUpdateNode
  } = useUpdateNode({ getMenuList });

  function handleBatchDelNode() {
    if((checkedMenus?.current?.checked || []).length === 0) {
      return message.error('请选择节点');
    }
    Modal.confirm({
      title: '温馨提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定删除选中的节点？',
      onOk() {
        systemApi.batchDeleteNode({
          nodeIds: checkedMenus.current.checked
        }).then(res => {
          getMenuList();
          checkedMenus.current = null;
        })
      }
    })
  }

  const { getUserMenuList } = useUserMenus();
  const [refreshUserMenuLoading, setRefreshUserMenuLoading] = useState();

  function onRefreshUserMenu() {
    setRefreshUserMenuLoading(true);
    getUserMenuList().finally(() => {
      setRefreshUserMenuLoading(false);
    })
  }

  function onSelectNode(keys, { node }) {
    setSelectedNode(keys.length ?  { ...node, icon: node.iconName} : {})
  }

  return (
    <StyleWrap>
      <Row justify="space-between">
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddChildNode}>添加子节点</Button>
          <Button icon={<PlusOutlined />} onClick={handleAddTopNode}>添加顶层节点</Button>
          <Button icon={<DeleteOutlined />} onClick={handleBatchDelNode}>批量删除</Button>
        </Space>
        <Button type="primary" icon={<RedoOutlined />} onClick={onRefreshUserMenu} loading={refreshUserMenuLoading}>刷新用户菜单</Button>
      </Row>
      
      <div className="main">
        <div className="main-tree">
          <MenuList
            checkable
            showIcon
            showLine={{ showLeafIcon: false }}
            style={{ color: '#515a6e' }}
            menuList={menuList}
            checkStrictly={true}
            onCheck={checkedKeys => { checkedMenus.current = checkedKeys;}}
            onSelect={onSelectNode}
          />
        </div>
        <div className="main-detail">
          <NodeForm node={selectedNode} isEdit ref={updateNodeRef} />
          <Row gutter={8} justify="center">
            <Button
              type="primary"
              disabled={!selectedNode.id}
              icon={<EditOutlined />}
              onClick={onUpdateNode}
              loading={updateNodeLoading}
            >修改并保存</Button>
          </Row>
        </div>
      </div>
      <Modal
        title="添加节点"
        visible={isShowAddNode}
        onOk={handleAddNode}
        onCancel={closeAddNodeModal}
      >
        <NodeForm ref={addNodeRef} parentNode={parentNode} />
      </Modal>
    </StyleWrap>
  )
})
