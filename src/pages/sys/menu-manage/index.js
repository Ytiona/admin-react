import React, { memo, useState, useRef } from 'react';
import { 
  Button, Space,
  Modal, Row, Col
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, 
  EditOutlined,
  ReloadOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import * as systemApi from '@/api/system';
import { StyleWrap } from './style';
import MenuList from './menu-list';
import NodeForm from './node-form';
import { useMenuList } from './hooks';

function useAddNode() {
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
  function handleAddNode() {
    const { nodeForm, validateForm } = addNodeRef.current;
    validateForm().then(res => {
      systemApi.addNode(nodeForm).then(res => {
        setIsShowAddNode(false);
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
    setSelectedNode
  }
}

export default memo(function MenuManage() {
  const { menuList } = useMenuList();
  const {
    addNodeRef,
    parentNode,
    isShowAddNode, 
    setIsShowAddNode,
    handleAddChildNode,
    handleAddTopNode,
    handleAddNode,
    selectedNode,
    setSelectedNode
  } = useAddNode();
  
  function handleBatchDelNode () {
    Modal.confirm({
      title: '温馨提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定删除选中的节点？',
      onOk() {
        console.log('confirm delete!');
      }
    })
  }

  return (
    <StyleWrap>
      <Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddChildNode}>添加子节点</Button>
        <Button icon={<PlusOutlined />} onClick={handleAddTopNode}>添加顶层节点</Button>
        <Button icon={<DeleteOutlined />} onClick={handleBatchDelNode}>批量删除</Button>
      </Space>
      <div className="main">
        <div className="main-tree">
          <MenuList
            checkable
            showIcon
            showLine={{showLeafIcon: false}}
            style={{ color: '#515a6e' }}
            menuList={menuList}
            onSelect={(key, { node }) => setSelectedNode(node)}
          />
        </div>
        <div className="main-detail">
          <NodeForm node={selectedNode} isEdit/>
          <Row gutter={8} justify="center">
            <Col><Button type="primary" htmlType="submit" icon={<EditOutlined />}>修改并保存</Button></Col>
            <Col><Button icon={<ReloadOutlined />}>重置</Button></Col>
          </Row>
        </div>
      </div>
      <Modal
        title="添加节点" 
        visible={isShowAddNode} 
        onOk={handleAddNode} 
        onCancel={() => { setIsShowAddNode(false) } }
      >
        <NodeForm ref={addNodeRef} parentNode={parentNode}/>
      </Modal>
    </StyleWrap>
  )
})
