import * as AntdIconGather from '@ant-design/icons';

const result = {};

const antdIcons = Object.entries(AntdIconGather).filter(item => typeof item[1] === 'object').slice(1, 787);

antdIcons.forEach(item => {
  result[item[0]] = item[1];
})

export default result;