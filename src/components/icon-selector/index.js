import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Input } from 'antd';
import * as AntdIconGather from '@ant-design/icons';
import { IconSelectorWrap } from './style';

const antdIcons = Object.entries(AntdIconGather).filter(item => typeof item[1] === 'object').slice(1, 787);

const outlinedIcons = [],
  filledIcons = [],
  twoToneIcons = [];

for (let i = 0, len = antdIcons.length; i < len; i++) {
  const item = antdIcons[i];
  if (item[0].endsWith('Outlined')) {
    outlinedIcons.push(item);
  } else if (item[0].endsWith('Filled')) {
    filledIcons.push(item);
  } else if (item[0].endsWith('TwoTone')) {
    twoToneIcons.push(item);
  }
}

const { TabPane } = Tabs;

function IconList({ icons, searchKey, onSelect }) {
  return (
    <div className="antds">
      {
        icons
        .filter(item => item[0].includes(searchKey))
        .map(item => {
          const name = item[0];
          const Icon = item[1];
          return (
            <div className="icon-item" key={name} onClick={() => { onSelect(name) }}>
              <Icon className="icon" />
              <p className="name">{name}</p>
            </div>
          )
        })
      }
    </div>
  )
}

const IconSelector = memo(function IconSelector({ onSelect }) {
  const [searchKey, setSearchKey] = useState('');
  function onSelectAntdIcon(name) {
    onSelect && onSelect(name, '0');
  }
  return (
    <IconSelectorWrap>
      <Tabs type="card">
        <TabPane tab="antd icon" key={0}>
          <div className="search-box">  
            <Input 
              className="search-inp"
              placeholder="输入图标名称搜索" 
              bordered={false}
              suffix={<AntdIconGather.SearchOutlined className="suffix"/>}
              value={searchKey}
              onChange={event => { setSearchKey(event.target.value) }}
            />
          </div>
          <Tabs centered>
            <TabPane key={0} tab={<span><AntdIconGather.HeartOutlined />线框风格</span>}>
              <IconList icons={outlinedIcons} searchKey={searchKey} onSelect={onSelectAntdIcon} />
            </TabPane>
            <TabPane key={1} tab={<span><AntdIconGather.HeartFilled />实底风格</span>}>
              <IconList icons={filledIcons} searchKey={searchKey}  onSelect={onSelectAntdIcon} />
            </TabPane>
            <TabPane key={2} tab={<span><AntdIconGather.SmileOutlined />双色风格</span>}>
              <IconList icons={twoToneIcons} searchKey={searchKey}  onSelect={onSelectAntdIcon} />
            </TabPane>
          </Tabs>
        </TabPane>
        <TabPane tab="iconfont" key={1}></TabPane>
        <TabPane tab="自定义图片" key={2}></TabPane>
      </Tabs>
    </IconSelectorWrap >
  )
})


IconSelector.propTypes = {
  onSelect: PropTypes.func
}

IconList.propTypes = {
  icons: PropTypes.array.isRequired, 
  searchKey: PropTypes.string, 
  onSelect: PropTypes.func
}

export default IconSelector;