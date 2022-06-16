import { get, post, deletefn, put } from "./unit/request";

// api 分页列表
// export const GetGlobalList = async (params) => {
//       try {
//         const res = await  post('/config/global/list', params);
//         return res?.data.roluelist ?? []
//       } catch(e)  {
//         return []
//       }
//     }

// 获取 节点字典

export const getAllBusinessConfig = (params) => get(`/config/businessConfig/getAllBusinessConfig`, params);
// 清除缓存的数据
export const clearRedisBusinessConfigCode = (params) =>
  get(`/config/businessConfig/clearRedisBusinessConfigCode`, params);

// 校验业务code
export const checkCode = (params) => get(`/config/businessConfig/checkBusinessConfigCode`, params);

// 获取项目列表及子业务级联

export const getProjectList = (params) => post("/config/businessConfig/projectList", params);

// api 分页列表
export const GetGlobalList = (params) => post("/config/global/list", params);

// api新增
export const postSaveOrEdite = (params) => post("/config/global/create", params);
// api修改
export const putSaveOrEdite = (params) => put("/config/global/update", params);

// 获取api 类型
export const apiTypeList = (params) => get(`config/global/apiTypeList`, params);

// 获取详情
export const apiDetail = (params) => get(`/config/global/bean`, params);

// 调用配置处理
export const executeApi = (params) => post("/config/global/executeApi", params);

// 访问配置删除
// 删除表单
export const deleteApi = (id) => deletefn("/config/global/delete", { id: id });

export const simulationRequest = (params) => post("/config/global/simulationRequest", params);

// // 业务配置 list

export const getBusinessConfigBasicList = (params) =>
  get(`/config/businessConfig/getBusinessConfigBasicList?tenantId=${params}`);

export const getDicDataByClassify = () => get(`/config/dicData/getDicDataByClassify?classify=sys`);

export const checkBusinessConfig = (params) =>
  // get(`/config/businessConfig/checkBusinessConfig?type=${params.type}&name=${params.name}`);
  get("/config/businessConfig/checkBusinessConfig", params);

// export const addBusinessConfig = (params) =>
//     post('/config/businessConfig/saveBusinessConfigWithTree', params);

// 新增项目资源树
export const createBusinessConfig = (params) => post("/config/businessConfig/businessConfigWithTree/create", params);

// 修改项目资源树
export const updateBusinessConfig = (params) => put("/config/businessConfig/businessConfigWithTree/update", params);

// 查询配置树状结构
export const getBusinessConfigWithTree = (id, tenantId) =>
  get(`/config/businessConfig/getBusinessConfigWithTree?tenantId=${tenantId}&id=${id}`);
// 删除配置
export const deleteBusinessConfig = (id) => deletefn(`/config/businessConfig/delete`, { id: id });

// export const UpdatebusinessConfig = (params) => put(`/config/businessConfig`, params);
// export const UpdatebusinessConfig = (params) => put(`/config/businessConfig/businessConfigWithTree/create`, params);

export const startConfig = (params) => put("/config/startConfig/update", params);

export const getThirdInterfaceList = (params) => get(`/config/global/getThirdInterfaceList`, params);
//根据业务节点获取配置
export const selectProcessStartConfigList = (id, tenantId) =>
  get(`/config/startConfig/selectProcessStartConfigList?tenantId=${tenantId}&businessConfigId=${id}`);

export const checkApiType = (params) => post(`/config/global/checkApiType`, params);

export const selectProcessStartConfigByCode = (params) =>
  post(`/config/startConfig/selectProcessStartConfigByCode`, params);

// 获取全局唯一id
export const getGlobalUuid = () => get(`/config/global/uuid`);
