import axios from 'axios';

import { exec } from './helpers';

// 1.请求限制

// 2.请求取消

// 3.请求缓存

// 4.固定参数

// 5.请求防抖

// 6.请求节流

// 7.文件上传

export class Http {
  constructor({
    useHttp
  }) {
    this.http = new axios();
    exec(useHttp, http);
  }
}

export default new Http();
