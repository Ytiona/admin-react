import http from "@/utils/http";
import { shallowMergeObj } from '@/utils/helpers';
import store from '@/store';

function get (api, defaultParams, defaultOption) {
  return function (params, option) {
    return http.get.bind(http)(
      api, 
      shallowMergeObj(defaultParams, params),
      shallowMergeObj(defaultOption, option)
    )
  }
}

function post (api, defaultData, defaultOption) {
  return function (data, option) {
    return http.post.bind(http)(
      api, 
      shallowMergeObj(defaultData, data),
      shallowMergeObj(defaultOption, option)
    )
  }
}

//获取用户信息
export const getUserInfo = get('/user/getUserInfo');

//获取我的企业
export const getMyEnterprise = get('/user/getMyEnterprise')

//更新头像
export const updateAvatar = post('/user/updateAvatar')
// updateAvatar({
//   avatar: 'xxx'
// }, {
//   concurrent: true//开启并发
// })


//获取我发的优惠券
export const getSendCoupons = get('/user/getSendCoupons', {
  pageSize: 20
})

//搜索企业
export const searchCompanys = post('/company/searchCompanys')
// searchCompanys({
//   searchKeys: 'xx'
// }, {
//   debounce: 800
// })

//生成服务报告
export const createServeReport = post('/company/createServeReport')
// let createServeReportCanceler;
// userApi.createServeReport({
//   orgId: 'xxx'
// }, {
//   cancel: true,
//   cancel: canceler => {
//     createServeReportCanceler = canceler;
//   }
// })
// console.log(createServeReportCanceler());

export const getIndustryList = get('/config/getIndustryList');

// const cacheObj = {};
// getIndustryList({}, {
//   使用实例内部存储器（初始化http实例时传入的存储器 || ）
//   cache: true,
//   使用普通js对象作为存储器
//   cache: {
//     set: (key, data) => {
//       return cacheObj[key] = data;
//     },
//     get: key => {
//       return cacheObj[key];
//     }
//   },
//   使用vuex作为存储器
//   cache: {
//     set: (key, data) => {
//       return store.commit('setCache', key, data)
//     },
//     get: key => {
//       return store.getters.getCache(key)
//     }
//   }
// })

