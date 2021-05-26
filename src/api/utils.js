import http from '@/utils/http';
import { shallowMergeObj } from '@/utils/helpers';

export function getWrap (api, defaultParams, defaultOption) {
  return function (params, option) {
    return http.get.bind(http)(
      api, 
      shallowMergeObj(defaultParams, params),
      shallowMergeObj(defaultOption, option)
    )
  }
}

export function postWrap (api, defaultData, defaultOption) {
  return function (data, option) {
    return http.post.bind(http)(
      api, 
      shallowMergeObj(defaultData, data),
      shallowMergeObj(defaultOption, option)
    )
  }
}