import React, { memo, useState, useEffect, useRef } from 'react';
import { Drawer, Space, Button, Tree } from 'antd';
import PropTypes from 'prop-types';
import * as systemApi from '@/api/system';
import { apiListToTree } from '@/lib/common';
import styled from 'styled-components';
import { useRequest } from '@/hooks/base-hooks';

const TreeNodeWrap = styled.div`
  .addr {
    line-height: 1;
  }
`;

const AuthApi = memo(function AuthApi({
  visible,
  setHide,
  role
}) {
  const [apiTree, setApiTree] = useState([]);
  useEffect(() => {
    systemApi.getAuthApiList().then(res => {
      setApiTree(apiListToTree(res.result, item => {
        const { name, addr } = item;
        return (
          <TreeNodeWrap>
            <div className="name">{name}</div>
            <div className="addr min-desc">{addr}</div>
          </TreeNodeWrap>
        )
      }));
    })
  }, [])
  const selectedApis = useRef([]);
  const onCheckApi = (checkedKeys, { checkedNodes }) => {
    // 无children的才是api节点，而非分组
    selectedApis.current = checkedNodes.filter(item => !item.children);
  }
  const [authLoading, setAuthLoading] = useState(false);
  function authApi() {
    setAuthLoading(true);
    return systemApi.roleApiAuth({
      roleCode: role.code,
      apiAddrs: selectedApis.current.map(item => item.addr)
    }).then(setHide).finally(() => {
      setAuthLoading(false);
    })
  }

  return (
    <Drawer
      visible={visible}
      onClose={setHide}
      title="接口权限"
      width={600}
      footer={
        <Space className="flex flex-end">
          <Button onClick={setHide}>取消</Button>
          <Button type="primary" onClick={authApi} loading={authLoading}>确定</Button>
        </Space>
      }
    >
      <Tree
        checkable
        treeData={apiTree}
        className="api-tree"
        onCheck={onCheckApi}
      />
    </Drawer>
  )
})

AuthApi.propTypes = {

}



export default AuthApi

