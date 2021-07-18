import React, { memo, useEffect, useState, useRef } from 'react';
import { Menu, Table, Tag } from 'antd';
import { CopyOutlined, FolderOpenOutlined } from '@ant-design/icons';
import * as systemApi from '@/api/system';
import { ApiManageWrap } from './style';
import { getInnerText } from '@/utils/helpers';
import { apiListToTree } from '@/lib/common';

const paramsColumns = [
  { title: '字段', dataIndex: 'field' },
  { 
    title: '类型', 
    dataIndex: 'type',
    width: 150,
    render: type => <Tag>{type}</Tag>
  },
  { 
    title: '描述', dataIndex: 'desc', width: 300, 
    render: value => <div className="min-desc">{getInnerText(value)}</div>
  },
  { 
    title: '可选', 
    dataIndex: 'optional', 
    align: 'center', 
    width: 100,
    render: value => value ? <Tag color="warning">否</Tag> : <Tag color="success">是</Tag>
  },
]

const responseColumns = [
  { title: '字段', dataIndex: 'field' },
  { 
    title: '类型', 
    dataIndex: 'type',
    width: 150,
    render: type => <Tag>{type}</Tag>
  },
  { 
    title: '描述', dataIndex: 'desc', width: 300,
    render: value => <div className="min-desc">{getInnerText(value)}</div>
  }
]

const ApiManage = memo(function ApiManage(props) {
  const [apiList, setApiList] = useState([]);
  const flatApiList = useRef([]);
  const [currentApis, setCurrentApis] = useState([]);
  useEffect(() => {
    systemApi.getApiList().then(res => {
      const { result = [] } = res;
      flatApiList.current = result;
      setApiList(apiListToTree(result));
    })
  }, [])
  function onSelectNav({ key }) {
    const _flatApiList = flatApiList.current;
    const currentApi = _flatApiList.find(item => item.addr === key) || {};
    if(currentApi.group) {
      setCurrentApis(_flatApiList.filter(item => item.group === currentApi.group));
    } else {
      setCurrentApis(_flatApiList.filter(item => !item.group));
    }
  }
  return (
    <ApiManageWrap>
      <Menu mode="inline" className="nav" onSelect={onSelectNav}>
        {
          apiList.map(item => {
            if(item.children) {
              return (
                <Menu.SubMenu title={item.group} key={item.group} icon={<FolderOpenOutlined />}>
                  {
                    item.children.map(item => 
                      <Menu.Item key={item.addr}>
                        { item.name }<span className="min-desc ml-5">/{item.lastAddr}</span>
                      </Menu.Item>
                    )
                  }
                </Menu.SubMenu>
              )
            }
            return <Menu.Item key={item.addr}>
              { item.name }<span className="min-desc ml-5">/{item.lastAddr}</span>
            </Menu.Item>
          })
        }
      </Menu>
      <div className="api-list">
        {
          currentApis.map(item => (
            <div className="item" key={item.addr}>
              <div className="top">
                <div className="name">{item.name}</div>
                <div className="desc">{item.desc}</div>
              </div>
              <div className="api">
                <div className="flex">
                  <Tag color={item.method === 'GET' ? 'green' : 'blue'}>{ item.method }</Tag>
                  <div className="addr">{item.addr}<CopyOutlined className="copy-btn"/></div>
                </div>
                { item.auth ? <Tag color="#08f">角色鉴权</Tag> : null }
              </div>
              <Table
                bordered
                pagination={false}
                size="small"
                className="mb-10"
                title={() => <div className="table-head params">请求参数</div>}
                columns={paramsColumns}
                dataSource={JSON.parse(item.params).map((item, index) => ({...item, key: index}))}
              />
              <Table
                bordered
                pagination={false}
                size="small"
                title={() => <div className="table-head response">响应结果</div>}
                columns={responseColumns}
                dataSource={JSON.parse(item.response).map((item, index) => ({...item, key: index}))}
              />
            </div>
          ))
        }
      </div>
    </ApiManageWrap>
  )
})

export default ApiManage
