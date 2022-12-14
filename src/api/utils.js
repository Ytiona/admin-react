import http from '@/utils/http';
import { shallowMergeObj } from '@/utils/helpers';
import { message, notification, Modal } from 'antd';

export const SUCCESS_CODE = 0;
export const FAIL_CODE = -1;
export const WARNING_CODE = -2;

const codes = [SUCCESS_CODE, FAIL_CODE, WARNING_CODE];

const plans = handleFeedbackPlan();

const defaultConfig = {
  get: {
    checkCode: true,
    correctCode: 0
  },
  post: {
    checkCode: true,
    correctCode: 0,
    loading: true,
    loadingConfig: '正在提交...',
    successTip: true,
    successTipType: 'msg',
    successTipConfig: res => res.msg,
    failTip: true,
    failTipType: 'msg',
    failTipConfig: res => res.msg,
    warningTip: true,
    warningTipType: 'msg',
    warningTipConfig: res => res.msg
  },
  upload: {
    checkCode: true,
    correctCode: 0,
    loading: true,
    loadingConfig: '正在上传...',
    successTip: true,
    successTipType: 'notify',
    successTipConfig: res => {
      return {
        message: '上传成功',
        description	: res.msg || '文件上传成功'
      }
    },
    failTip: true,
    failTipType: 'notify',
    failTipConfig: res => {
      return {
        message: '上传失败',
        description	: res.msg || '未知错误'
      }
    },
    warningTip: true,
    warningTipType: 'notify',
    warningTipConfig: res => {
      return {
        message: '警告！',
        description	: res.msg || '未知警告'
      }
    }
  }
}

export const getWrap = generatorWrap('get');

export const postWrap = generatorWrap('post');

export const uploadWrap = generatorWrap('upload');

function generatorWrap (method) {
  return function (api, defaultParams, defaultOption) {
    return function (params, option) {
      const mergedParams = shallowMergeObj(defaultParams, params);
      const requestConfig = shallowMergeObj(defaultConfig[method], mergedParams.$config);
      delete mergedParams.$config;
      let promise = http[method].bind(http)(
        api, 
        mergedParams,
        shallowMergeObj(defaultOption, option)
      )
      handleLoading(promise, requestConfig);
      handleFeedback(promise, requestConfig);
      promise = handleResponse(promise, requestConfig);
      return promise;
    }
  }
}

// 处理请求loading
function handleLoading(promise, config) {
  if(config.loading) {
    const clearLoading = message.loading(config.loadingConfig);
    promise.finally(clearLoading);
  }
}

// 处理请求反馈
function handleFeedback(promise, config) {
  promise.then(res => {
    if(!codes.includes(res.code)) return;
    const { able, type, config: tipConfig } = getConfig(config, res.code);
    if(able) {
      plans[type][res.code](tipConfig(res));
    }
  })
}

// 处理请求结果
function handleResponse(promise, config) {
  // 是否校验code值，才resolve结果，否则reject
  if(config.checkCode) {
    return new Promise((resolve, reject) => {
      promise.then(res => {
        if(res.code === config.correctCode) {
          return resolve(res);
        }
        return reject(res);
      }, reject)
    })
  }
  return promise;
}

function handleFeedbackPlan() {
  const plans = {
    msg: {},
    notify: {},
    modal: {}
  }
  codeIteration(plans.msg, [message.success, message.error, message.warning]);
  codeIteration(plans.notify, [notification.success, notification.error, notification.warning]);
  codeIteration(plans.modal, [Modal.success, Modal.error, Modal.warning]);
  return plans;
}

function getConfig(config, code) {
  const configs = {};
  codeIteration(configs, [
    {
      able: config.successTip,
      type: config.successTipType,
      config: config.successTipConfig
    },
    {
      able: config.failTip,
      type: config.failTipType,
      config: config.failTipConfig
    },
    {
      able: config.warningTip,
      type: config.warningTipType,
      config: config.warningTipConfig
    }
  ])
  return configs[code];
}

function codeIteration(store, args) {
  codes.forEach((item, index) => {
    store[item] = args[index];
  })
}

