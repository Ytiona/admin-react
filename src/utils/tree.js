export function handleTreeField(treeData, fieldMap) {
  const result = [];
  const keys = Object.keys(fieldMap);
  function handler (data, store = result) {
    if(!Array.isArray(data)) return; 
    for(let i = 0, len = data.length; i < len; i++) {
      const obj = {
        children: []
      };
      const node = data[i];
      keys.forEach(item => {
        obj[item] = node[fieldMap[item]];
      })
      store.push(obj);
      if(node.children && node.children.length > 0) {
        handler(node.children, obj.children);
      }
    }
  }
  handler(treeData);
  return result;
}

export function treeIterator(treeData, callback) {
  function handler (data) {
    if(!Array.isArray(data)) return; 
    for(let i = 0, len = data.length; i < len; i++) {
      const node = data[i];
      callback(node);
      if(node.children && node.children.length > 0) {
        handler(node.children);
      }
    }
  }
  handler(treeData);
  return treeData;
}