import React, { memo, useEffect, useState, useRef } from 'react';
import { Menu, Table, Tag, Switch } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import * as systemApi from '@/api/system';
import { ApiManageWrap } from './style';
import { getInnerText } from '@/utils/helpers';

// name\addr\method\desc\group\params\response\auth
// 接口名称、接口描述、接口地址、参数表格、返回值表格

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
      const _apiList = [];
      const groupIdxMap = {};
      result.forEach(item => {
        item.lastAddr = item.addr.split('/').slice(-1);
        const { group } = item;
        // 有分组
        if(group) {
          const groupIdx = groupIdxMap[group];
          // 分组已存在
          if(groupIdx !== undefined) {
            // 往分组添加子元素
            _apiList[groupIdx].children.push(item);
          } else {
            // 创建分组，并将当期元素存入为第一个子元素
            const len = _apiList.push({
              group: item.group,
              children: [item]
            });
            // 记住分组的索引，用于下次读取
            groupIdxMap[item.group] = len - 1;
          }
        } else {
          // 无分组，则放在外层
          _apiList.push(item);
        }
      })
      flatApiList.current = result;
      setApiList(_apiList);
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
                <Menu.SubMenu title={item.group} key={item.group}>
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
                <div className="addr">{item.addr}<CopyOutlined className="copy-btn"/></div>
              </div>
              <div className="flex between mb-5">
                <div className="min-desc">{item.desc}</div>
                <Switch checkedChildren="开启鉴权" unCheckedChildren="关闭鉴权" defaultChecked={!!item.auth} className="auth-switch"/>
              </div>
              <Table
                bordered
                pagination={false}
                size="small"
                className="mb-10"
                title={() => <div className="table-head params">请求参数</div>}
                columns={paramsColumns}
                dataSource={JSON.parse(item.params)}
              />
              <Table
                bordered
                pagination={false}
                size="small"
                title={() => <div className="table-head response">响应结果</div>}
                columns={responseColumns}
                dataSource={JSON.parse(item.response)}
              />
            </div>
          ))
        }
      </div>
    </ApiManageWrap>
  )
})

export default ApiManage
