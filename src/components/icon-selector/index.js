import React, { memo } from 'react'
import { Tabs } from 'antd';
import * as AntdIconGather from '@ant-design/icons';
import { IconSelectorWrap } from './style';

const AntdIcons = Object.entries(AntdIconGather).filter(item => typeof item[1] === 'object').slice(1, 787);

const { TabPane } = Tabs;

export default memo(function IconSelector() {
  return (
    <IconSelectorWrap>
      <Tabs type="card">
        <TabPane tab="antd icon" key={0}>
          <div className="antds">
            {
              AntdIcons.map(item => {
                const [name, Icon] = item;
                return (
                  <div className="icon-item" key={name}>
                    <Icon className="icon"/>
                    <p className="name">{ name }</p>
                  </div>
                )
              })
            }
          </div>
        </TabPane>
        <TabPane tab="iconfont" key={1}></TabPane>
        <TabPane tab="自定义图片" key={2}></TabPane>
      </Tabs>
      
    </IconSelectorWrap>
  )
})
