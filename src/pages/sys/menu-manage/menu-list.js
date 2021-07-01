import React, { memo, useEffect, useState } from 'react';
import { Tree } from 'antd';
import { 
  FolderOpenOutlined, FileOutlined, 
  GoldOutlined
} from '@ant-design/icons';
import { treeIterator } from '@/utils/tree';

const treeIconMap = {
  0: <FolderOpenOutlined />,
  1: <FileOutlined />,
  2: <GoldOutlined />
}

export default memo(function MenuList({ menuList, ...treeProps }) {
  const [_menuList, set_MenuList] = useState([]);
  useEffect(() => {
    set_MenuList(
      treeIterator(
        menuList, 
        item => {
          item.title = item.name;
          item.key = item.id;
          item.iconName = item.icon;
          item.icon = treeIconMap[item.type];
        }
      )
    )
  }, [menuList])

  return (
    <Tree
      {...treeProps}
      treeData={_menuList}
    />
  )
})
