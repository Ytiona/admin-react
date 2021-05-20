import axios from 'axios';
import md5 from 'md5';
import { validator} from '@/utils/helpers';

// 1.请求并发限制  post 同接口同参数 默认禁止并发

// 2.请求取消  布尔/hook

// 3.请求缓存  单独配置为true，则采用实例的存储器，传了存储器则采用存储器，存储器(传入一个带有get、set方法的对象, 可连接vuex、redux等)

// 4.固定参数  ok

// 5.请求防抖  数值，防抖间隔

// 6.请求节流  数值，节流间隔

// 7.文件上传   待定

export class Http {
  constructor({
    useHttp,
    getUniKey,
    cacheStore
  } = {}) {
    this.http = axios.create();
    validator.isFunction(useHttp, () => {
      useHttp(this.http);
    })
    validator.isFunction(getUniKey, () => {
      this.getUniKey = getUniKey;
    })
    validator(cacheStore, ['boolean', 'object'], (type) => {
      
    })
  }

  getUniKey(api, params) {
    return md5(`${api} ${JSON.stringify(params)}`);
  }

  get(url, params, option) {
    console.log(url, params, option);
    
  }

  post(url, data, option) {
    console.log(url, data, option);
    if(typeof option.cancel === 'function') {
      option.cancel(() => {
        this.cancel(this.getUniKey(url, data));
      });
    }
  }

  cancel() {
    console.log('请求已取消');
  }

  clearCache(key) {

  }
}

export default new Http({
  cacheStore: true
});


