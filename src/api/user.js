import { getWrap as get, postWrap as post } from './utils';

//获取用户信息
export const getUserInfo = get('/', {}, { freshTime: 1000 });

export const postTest = post('/post');

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

