import {
    get,
    post,
    deletefn,
    put
} from '../unit/request'

 // api 分页列表
export const GetGlobalList = (params) =>
    post('/config/global/list', params);

// api 保存修改

export const saveOrEdite = (params) =>
    post('/config/global', params);
// 获取api 类型
export const apiTypeList = (params) =>
    get(`config/global/apiTypeList?tenantId=${params}`);

// 获取详情
export const apiDetail = (params) =>
    get(`/config/global/bean`, params);
