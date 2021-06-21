import axios from 'axios';
import md5 from 'md5';
import { validator, shallowMergeObj, getType } from '@/utils/helpers';

/**
 * @Description 基于axios的请求类封装，具有：取消、缓存、并发限制、响应复用等功能
 * @param  {Function} useHttp 选填 axios实例的钩子
 * @param  {Function} getRequestKey 选填 自定义请求unikey生成方法
 * @param  {Object} cacheStore 选填 缓存仓库，须具有get、set方法
 * @param  {Number} cacheMax 选填 最大缓存变量数
 * @param  {Number} axiosConfig 选填 axios.create的配置
 * @param  {Object} defaultRequestOption 选填 默认请求选项，例：默认post同接同参数的请求都会限制并发，请求方法（set、post）的映射
 * @return {Http} 请求工具实例类
 */
export class Http {
  constructor({
    useHttp,
    getRequestKey,
    cacheStore,
    cacheMax = 100,
    axiosConfig,
    defaultRequestOption
  } = {}) {
    this.http = axios.create(axiosConfig);
    this.requestPool = {};// 请求池，存储请求状态等信息
    this.CancelToken = axios.CancelToken;
    this.cacheMax = cacheMax;
    this.cacheArr = [];
    this.initDefaultRequestOption();
    this.initDefaultCacheStore();
    validator.isFunction(useHttp, () => {
      useHttp(this.http);
    })
    validator.isFunction(getRequestKey, () => {
      this.getRequestKey = getRequestKey;
    })
    validator.isObject(cacheStore, () => {
      const { get, set } = cacheStore;
      if (!validator.isFunction(set)) {
        throw new Error('cacheStore must have set function');
      }
      if (!validator.isFunction(get)) {
        throw new Error('cacheStore must have get function');
      }
      this.cacheStore = cacheStore;
    })
    validator.isObject(defaultRequestOption, () => {
      this.defaultRequestOption = defaultRequestOption;
    })
    this.generateRequestMethod();
  }
  // 初始默认请求仓库
  initDefaultCacheStore() {
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
  }

  // 初始默认请求配置
  initDefaultRequestOption() {
    this.defaultRequestOption = {
      post: {
        concurrency: false
      }
    }
  }

  // 生成请求方法
  generateRequestMethod() {
    this.request = this.requestMethodGenerator();
    const methods = ['get', 'post', 'delete', 'head', 'put', 'patch', 'options'];
    const needDataMethods = ['post', 'put', 'patch'];
    for (let i = 0; methods[i]; i++) {
      const item = methods[i];
      const paramsKey = needDataMethods.includes(item) ? 'data' : 'params';
      this[item] = this.requestMethodGenerator(item, paramsKey);
    }
    this.upload = this.requestMethodGenerator('post', 'data', {
      transformRequest: data => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
          formData.append(key, data[key]);
        })
        return formData;
      }
    });
  }

  /**
   * @Description 请求方法生成器，主要逻辑入口
   * @param {String} url api地址
   * @param {Object} params 请求参数
   * @param {Object} options 请求选项
   * @param {Boolean} options.cacel 是否遵循下一请求发出即取消上一请求
   * @param {Function} options.canceler 取消器钩子
   * @param {Boolean} options.cache 是否缓存请求
   * @param {Boolean} options.concurrency 是否允许并发
   * @param {Number} options.axiosOptions axios选项
   * @param {Number} options.freshTime 响应复用的数据新鲜时间（传了值，代表在某时长内复用第一个请求的响应结果），建议该配置写在api层
   * @return {Promise} 请求结果
   */
  requestMethodGenerator(method, paramsKey, initAxiosOptions) {
    return (url, params, options) => {
      const getRequestKey = options.getRequestKey || this.getRequestKey;
      const apiUniKey = getRequestKey(url, params);
      const requestOptions = shallowMergeObj(initAxiosOptions, options.axiosOptions, { url, method });
      requestOptions[paramsKey] = params;
      return this.iterator(
        [
          this.handleConcurrent,// 并发
          this.handleCacel,// 取消
          this.handleResponseReuse,// 响应复用
          this.handleCache,// 缓存
          this.sendRequest(requestOptions),// 发送请求
        ], 
        apiUniKey, 
        shallowMergeObj(this.defaultRequestOption[method], options)
      )
    }
  }

  // 获取请求唯一key
  getRequestKey(api, params) {
    return md5(`${api} ${JSON.stringify(params)}`);
  }

  // 模块迭代器
  iterator(fnArr, apiUniKey, options) {
    const instance = this;
    return new Promise((resolve, reject) => {
      let idx = 0;
      function exec() {
        const next = () => { idx++; exec(); }
        fnArr[idx].bind(instance)({ resolve, reject, next }, apiUniKey, options);
      }
      exec();
    })
  }

  // 处理并发
  handleConcurrent({ next, reject }, apiUniKey, { concurrency }) {
    const sameRequest = this.requestPool[apiUniKey] || {};
    if (concurrency === false && sameRequest.state === 'pending') {
      return reject({ message: 'Request concurrency is limited' });
    }
    next();
  }

  // 处理请求取消
  handleCacel({ next }, apiUniKey, { cancel }) {
    const sameRequest = this.requestPool[apiUniKey] || {};
    if (cancel === true && sameRequest.state === 'pending') {
      sameRequest.canceler('The request was cancelled by subsequent requests');
    }
    next();
  }

  // 处理响应复用
  handleResponseReuse({ next, resolve, reject }, apiUniKey, { freshTime }) {
    if (typeof freshTime === 'number') {
      const { promise, fresh } = this.requestPool[apiUniKey] || {};
      if (promise && fresh) {
        return promise.then(resolve, reject);
      }
    }
    next();
  }

  // 处理缓存
  handleCache({ next, resolve }, apiUniKey, { cache }) {
    if (cache) {
      const cacheData = this.cacheStore.get(apiUniKey);
      if (cacheData) {
        return resolve(cacheData);
      }
    }
    next();
  }

  // 发送请求
  sendRequest(requestOption) {
    return ({ resolve, reject }, apiUniKey, { freshTime, useCanceler, cache }) => {
      if (!this.requestPool[apiUniKey]) {
        this.requestPool[apiUniKey] = {};
      }
      this.requestPool[apiUniKey].state = 'pending';
      if (typeof freshTime === 'number') {
        this.requestPool[apiUniKey].fresh = true;
      }
      const requestPromise = this.http({
        ...requestOption,
        cancelToken: new this.CancelToken(canceler => {
          this.requestPool[apiUniKey].canceler = canceler;
          useCanceler && useCanceler(canceler);
        })
      })
        .then(res => {
          if (cache) {
            this.setCache(apiUniKey, res);
          }
          if (typeof freshTime === 'number') {
            // 数据新鲜时间到期则清除
            setTimeout(() => {
              this.clearRequest(apiUniKey);
            }, freshTime)
          }
          resolve(res);
          return res;
        }, reject)
        .finally(() => {
          // 未设置新鲜时间，请求结束直接清除
          if (typeof freshTime !== 'number') {
            this.clearRequest(apiUniKey);
          }
        })
      // 存储promise对象，用于响应复用
      return this.requestPool[apiUniKey].promise = requestPromise;
    }
  }
  
  // 设置缓存，限制缓存数据数量
  setCache(apiUniKey, data) {
    if (this.cacheArr.length > this.cacheMax) {
      const firstApiKey = this.cacheArr.shift();
      this.cacheStore.set(firstApiKey, null);
    }
    this.cacheArr.push(apiUniKey);
    this.cacheStore.set(apiUniKey, data);
  }

  // 根据请求key将对应的请求从请求池中清除
  clearRequest(apiUniKey) {
    this.requestPool[apiUniKey] = null;
    delete this.requestPool[apiUniKey];
  }

  // 清空请求池
  clearRequestPool() {
    this.requestPool = {};
  }
}

const http = new Http({
  axiosConfig: {
    timeout: 1000 * 60 * 10,
    baseURL: 'http://localhost:3001',
    data: {
      PlatformID: '456123128745656',
      PlatformName: '政策快车'
    }
  },
  useHttp: axios => {
    axios.interceptors.request.use(config => {
      config.headers.Authorization = Date.now();
      return config;
    })
    axios.interceptors.response.use(res => {
      const data = res.data;
      return data;
    })
  }
})

export default http;

