import axios from 'axios';
import md5 from 'md5';
import { validator} from '@/utils/helpers';

// 1.请求并发限制  post 同接口同参数 默认禁止并发
// 2.请求取消  布尔/hook
// 3.请求缓存  单独配置为true，则采用实例的存储器，传了存储器则采用存储器，存储器(传入一个带有get、set方法的对象, 可连接vuex、redux等)
// 4.固定参数  ok
// 5.文件上传   待定

/**
 * @Description 基于axios的请求类封装，具有：取消、缓存、并发限制、防抖、节流、响应复用等功能
 * @param  {Function} useHttp axios实例的钩子
 * @param  {Function} getUniKey 自定义请求unikey生成方法
 * @param  {Number} cacheMax 最大缓存变量数
 * @param  {Object} cacheStore 缓存仓库，须具有get、set方法
 * @param  {Object} defaultRequestOption 默认请求选项，例：默认post同接同参数的请求都会限制并发，请求方法（set、post）的映射
 * @return {Http} 请求工具实例类
 */
export class Http {
  constructor({
    useHttp,
    getUniKey,
    cacheMax = 50,
    cacheStore,
    defaultRequestOption,
  } = {}) {
    this.http = axios.create();
    this.defaultRequestOption = {
      get: {
        responseReuse: 1000
      },
      post: {
        concurrent: false
      }
    };
    this.cacheMax = cacheMax;
    this.cacheStore = (function () {
      const store = {};
      return {
        set: function (key, data) {
          return store[key] = data;
        },
        get: function (key) {
          return store[key];
        }
      }
    }())
    validator.isFunction(useHttp, () => {
      useHttp(this.http);
    })
    validator.isFunction(getUniKey, () => {
      this.getUniKey = getUniKey;
    })
    validator.isObject(cacheStore, () => {
      const { get, set } = cacheStore;
      if(!validator.isFunction(set)) {
        throw new Error('cacheStore must have set function');
      }
      if(!validator.isFunction(get)) {
        throw new Error('cacheStore must have get function');
      }
      this.cacheStore = cacheStore;
    })
    validator.isObject(defaultRequestOption, () => {
      this.defaultRequestOption = defaultRequestOption;
    })
  }

  getUniKey(api, params) {
    return md5(`${api} ${JSON.stringify(params)}`);
  }

  /**
   * @param {String} url api地址
   * @param {Object} params 请求参数
   * @param {Object} option 请求选项
   * @param {Boolean} option.cacel 是否遵循下一请求发出即取消上一请求
   * @param {Function} option.canceler 取消器钩子
   * @param {Boolean} option.cache 是否缓存请求
   * @param {Number} option.debounce 防抖间隔
   * @param {Number} option.throttle 节流间隔
   * @param {Boolean} option.concurrent 是否允许并发
   * @param {Number} option.responseReuse 响应复用的数据新鲜时间（传了值，代表在某时长内复用第一个请求的响应结果）
   * @return  {Promise} 请求结果
   */
  get(url, params, {
    cacel,
    canceler,
    cache,
    debounce,
    throttle,
    concurrent,
    responseReuse
  }) {
    
  }

  post(url, data, {
    cacel,
    canceler,
    cache,
    debounce,
    throttle,
    responseReuse,
    concurrent
  }) {

  }

  clearCache(key) {

  }
}

export default new Http({
  
});


