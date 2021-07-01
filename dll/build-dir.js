const fs = require('fs');
const path = require('path');

const axios = require('axios');

function resolve (dir) {
  return path.join(__dirname, dir);
}

function buildDir(data, validateDir, baseUrl) {
  data.forEach(item => {
    const dir = resolve(baseUrl + item.node_path);
    if(fs.existsSync(dir)) return; //已创建
    if(validateDir(item)) {
      fs.mkdir(dir, {
        recursive: true
      }, err => {
        console.log('mkdir error', err);
      })
    } else {
      const parentPath = dir.split('\\').slice(0, -1).join('\\');
      // 不存在父目录则创建
      if(!fs.existsSync(parentPath)) {
        fs.mkdir(parentPath, {
          recursive: true
        }, err => {
          console.log('mkdir error', err);
        })
      }
      fs.writeFile(dir, '', err => {
        console.log('writeFile error', err);
      })
    }
  })
}

axios.get('http://localhost:3001/sys/getMenuList').then(res => {
  // console.log(res);
  const data = res.data || {};
  const { menuList = [] } = data.result || {};
  buildDir(menuList, item => item.type === '0', '../src/pages');
})

