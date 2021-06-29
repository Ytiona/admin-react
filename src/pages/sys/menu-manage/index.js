import React, { memo, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
  Button, Space, Tree, Row, Col,
  Modal
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, 
  FolderOpenOutlined, FileOutlined, 
  GoldOutlined, EditOutlined,
  ReloadOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import { treeIterator } from '@/utils/tree';
import { StyleWrap } from './style';
import NodeForm from './node-form';
import * as systemApi from '@/api/system';

const treeIconMap = {
  0: <FolderOpenOutlined />,
  1: <FileOutlined />,
  2: <GoldOutlined />
}

export default memo(function MenuManage() {
  const { menuList } = useSelector(state => ({
    menuList: 
      treeIterator(
        state.getIn(['user', 'menuList']), 
        item => {
          item.title = item.name;
          item.key = item.id;
          item.icon = treeIconMap[item.type]
        }
      )
  }))
  const [isShowAddNode, setIsShowAddNode] = useState(false);
  const parentId = useRef(null);
  const selectedParentId = useRef(null);
  const addNodeRef = useRef();

  function handleAddChildNode () {
    parentId.current = selectedParentId;
    setIsShowAddNode(true);
  }
  function handleAddTopNode () {
    parentId.current = null;
    setIsShowAddNode(true);
  }
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
  function handleAddNode () {
    const { nodeForm, validateForm } = addNodeRef.current;
    validateForm().then(res => {
      systemApi.addNode(nodeForm).then(res => {

      })
    })
  }
  return (
    <StyleWrap>
      <Space>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddChildNode}
        >
          添加子节点
        </Button>
        <Button icon={<PlusOutlined />} onClick={handleAddTopNode}>添加顶层节点</Button>
        <Button icon={<DeleteOutlined />} onClick={handleBatchDelNode}>批量删除</Button>
      </Space>
      <div className="main">
        <div className="main-tree">
          <Tree
            checkable
            showIcon
            showLine={{showLeafIcon: false}}
            treeData={menuList}
            style={{ color: '#515a6e' }}
            onSelect={key => selectedParentId.current = key}
          />
        </div>
        <div className="main-detail">
          <NodeForm/>
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
        onCancel={() => { setIsShowAddNode(false) }}
      >
        <NodeForm ref={addNodeRef}/>
      </Modal>
    </StyleWrap>
  )
})
