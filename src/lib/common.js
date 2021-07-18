export function apiListToTree(apiList = [], titleCallback) {
  const _apiList = [];
  const groupIdxMap = {};
  apiList.forEach(item => {
    item.lastAddr = item.addr.split('/').slice(-1);
    item.title = titleCallback ? titleCallback(item) : item.name;
    item.key = item.addr;
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
          title: group,
          key: group,
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
  return _apiList;
}