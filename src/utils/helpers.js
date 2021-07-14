/**
 * @Description 判断值是否为空
 * @param {*} val 
 * @return {Boolean}
 */
export function isEmpty (val) {
  return val === '' || val === null || val === undefined;
}

/**
 * @Description 对象浅合并
 * @param  {...Object} args 
 * @return {Object}
 */
export function shallowMergeObj(...args) {
  return Object.assign({}, ...args);
}

/**
 * @Description 获取变量的类型
 * @param  {any} target 
 * @return {String}
 */
export function getType(target) {
  const template = {
      "[object Array]" : "array",
      "[object Object]" : "object",
      "[object Number]" : "number",
      "[object Boolean]" : "boolean",
      "[object String]" : "string"
  }
  //原始值引用值
  //区分引用值
  if (target === null){
      return "null";
  }
  if (typeof(target) == "object"){
      //数组对象包装类
      const str = Object.prototype.toString.call(target);
      return template[str];
  }
  return typeof(target);
}

/**
 * @Description 连字符转驼峰
 * @param  {any} str 
 * @return {String}
 */
export function camelize(str) {
  const camelizeRE = /-(\w)/g;
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '');
}

/**
 * @Description 首字符大写
 * @param  {any} str 
 * @return {String}
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * @Description 驼峰转连字符
 * @param  {any} str 
 * @return {String}
 */
export function hyphenate (str) {
  const hyphenateRE = /\B([A-Z])/g;
  return str.replace(hyphenateRE, '-$1').toLowerCase();
}

/**
 * @Description 校验器集合（校验各种类型）
 * @param  {any} value 
 * @param  {Function} callback 校验成功回调
 * @return {Boolean} 校验结果
 */
export const validator = (function () {
  function validator (value, types, callback) {
    const type = getType(value);
    const validateRes = types.includes(type);
    if(getType(callback) === 'function') {
      if(validateRes) {
        callback(type);
      } else if(value !== undefined){
        throw new Error(`Type verification failed, please input ${types} type`)
      }
    }
    return validateRes;
  }
  ['undefined', 'null', 'string', 'number', 'function', 'boolean', 'object', 'array'].forEach(item => {
    validator[`is${capitalize(item)}`] = function (value, callback) {
      return validator(value, [item], callback);
    }
  })
  return validator;
}())

export function usePromise() {
  let resolve,reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  })
  return {
    promise,
    resolve,
    reject
  }
}

export function getInnerText(htmlStr) {
  const div = document.createElement('div');
  div.innerHTML = htmlStr;
  return div.innerText;
}