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

// 调用配置处理
export const executeApi = (params) =>
    post('/config/global/executeApi', params);

// 访问配置删除
// 删除表单
export const deleteApi = (id) =>
    deletefn('/config/global/' + id);


export const simulationRequest = (params) =>
    post('/config/global/simulationRequest', params);

// // 业务配置 list

export const getBusinessConfigBasicList = (params) =>
    get(`/config/businessConfig/getBusinessConfigBasicList?tenantId=${params}`);

export const getDicDataByClassify = () =>
    get(`/config/dicData/getDicDataByClassify?classify=sys`);

export const checkBusinessConfig = (params) =>
    // get(`/config/businessConfig/checkBusinessConfig?type=${params.type}&name=${params.name}`);
    get('/config/businessConfig/checkBusinessConfig', params);

export const addBusinessConfig = (params) =>
    post('/config/businessConfig/saveBusinessConfigWithTree', params);


 // 查询配置树状结构
export const getBusinessConfigWithTree = (id, tenantId ) =>
    get(`/config/businessConfig/getBusinessConfigWithTree/${tenantId}/${id}`);
// 删除配置
export const deleteBusinessConfig = (id) =>
    deletefn(`/config/businessConfig/${id}`)
export const UpdatebusinessConfig = (params) =>
    put(`/config/businessConfig`, params)


export const startConfig = (params) =>
    post('/config/startConfig', params);

export const getThirdInterfaceList = ( tenantId ) =>
    get(`/config/global/getThirdInterfaceList?tenantId=${tenantId}`);
//根据业务节点获取配置
export const selectProcessStartConfigList = (id, tenantId ) =>
    get(`/config/startConfig/selectProcessStartConfigList?tenantId=${tenantId}&businessConfigId=${id}`);

export const checkApiType = (params ) =>
    get(`/config/global/checkApiType`, params);




