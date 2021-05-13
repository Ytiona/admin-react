/**
 * @Description 判断值是否为空
 * @param {*} val 
 * @returns {Boolean}
 */
export function isEmpty (val) {
  return val === '' || val === null || val === undefined;
}

/**
 * @Description 执行方法
 * @param {Function} fn 
 * @param  {...any} args 
 * @returns 
 */
export function exec(fn, ...args) {
  if(typeof fn === 'function') {
    return fn(...args);
  }
}

