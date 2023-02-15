import { get, post, deletefn, put } from './unit/request'

// api 分页列表
// export const GetGlobalList = async (params) => {
//       try {
//         const res = await  post('/config/global/list', params);
//         return res?.data.roluelist ?? []
//       } catch(e)  {
//         return []
//       }
//     }

export const thirdAuth = (params) => post(`/token/thirdAuth`, params)

export const processVariable = (params) => get(`/execute/processVariable`, params)

export const businessConfigWithTreeCreate = (params) =>
  post('/config/businessConfig/businessConfigWithTree/create', params)

// 获取 节点字典

export const getAllBusinessConfig = (params) => get(`/config/businessConfig/getAllBusinessConfig`, params)
// 清除缓存的数据
export const clearRedisBusinessConfigCode = (params) =>
  get(`/config/businessConfig/clearRedisBusinessConfigCode`, params)

// 校验业务code
export const checkCode = (params) => get(`/config/businessConfig/checkBusinessConfigCode`, params)

// 获取项目列表及子业务级联

export const getProjectList = (params) => post('/config/businessConfig/projectList', params)

// api 分页列表
export const GetGlobalList = (params) => post('/config/global/list', params)

// api新增
export const postSaveOrEdite = (params) => post('/config/global/create', params)
// api修改
export const putSaveOrEdite = (params) => put('/config/global/update', params)

// 获取api 类型
export const apiTypeList = (params) => get(`config/global/apiTypeList`, params)

// 获取详情
export const apiDetail = (params) => get(`/config/global/bean`, params)

// 调用配置处理
export const executeApi = (params) => post('/config/global/executeApi', params)

// 访问配置删除
// 删除表单
export const deleteApi = (id) => deletefn('/config/global/delete', { id: id })

export const simulationRequest = (params) => post('/config/global/simulationRequest', params)

// // 业务配置 list

export const getBusinessConfigBasicList = (params) =>
  get(`/config/businessConfig/getBusinessConfigBasicList?tenantId=${params}`)

export const getDicDataByClassify = () => get(`/config/dicData/getDicDataByClassify?classify=sys`)

export const checkBusinessConfig = (params) =>
  // get(`/config/businessConfig/checkBusinessConfig?type=${params.type}&name=${params.name}`);
  get('/config/businessConfig/checkBusinessConfig', params)

// export const addBusinessConfig = (params) =>
//     post('/config/businessConfig/saveBusinessConfigWithTree', params);

// 新增项目资源树
export const createBusinessConfig = (params) => post('/config/businessConfig/businessConfigWithTree/create', params)

// 修改项目资源树
export const updateBusinessConfig = (params) => put('/config/businessConfig/businessConfigWithTree/update', params)

// 查询配置树状结构
export const getBusinessConfigWithTree = (id, tenantId) =>
  get(`/config/businessConfig/getBusinessConfigWithTree?tenantId=${tenantId}&id=${id}`)
// 删除配置
export const deleteBusinessConfig = (params) => deletefn(`/config/businessConfig/delete`, params)

// export const UpdatebusinessConfig = (params) => put(`/config/businessConfig`, params);
// export const UpdatebusinessConfig = (params) => put(`/config/businessConfig/businessConfigWithTree/create`, params);

// 启动项删除
export const startConfigDelete = (params) => deletefn('/config/startConfig/delete', params)
// 启动项修改/config/startConfig/update
export const startConfigUpdate = (params) => put('/config/startConfig/update', params)

// 根据业务节点获取配置
export const checkIsReferenced = (params) => get(`/config/startConfig/checkIsReferenced`, params)

export const startConfig = (params) => post('/config/startConfig/create', params)
// 回去第三方杰奎
export const getThirdInterfaceList = (params) => get(`/config/global/getThirdInterfaceList`, params)
//根据业务节点获取配置
export const selectProcessStartConfigList = (id, tenantId) =>
  get(`/config/startConfig/selectProcessStartConfigList?tenantId=${tenantId}&businessConfigId=${id}`)

export const checkApiType = (params) => post(`/config/global/checkApiType`, params)
export const checkSourceSort = (params) => post(`config/global/checkSourceSort`, params)

export const selectProcessStartConfigByCode = (params) =>
  post(`/config/startConfig/selectProcessStartConfigByCode`, params)

// 获取全局唯一id
export const getGlobalUUID = () => get(`/config/global/uuid`)

// 获取选中节点表单
export const getSelectProcessStartForm = (params) => post(`/config/startConfig/selectProcessStartForm`, params)

// 关联节点表单
export const linkStartForm = (params) => post(`/config/startConfig/saveStartConfig`, params)

// 移除表单
export const removeStartForm = (params) => deletefn(`/config/startConfig/remove`, params)

// 文件上传
export const uploadFile = (params) => post(`/file/upload`, params)

// 文件下载
export const downloadFile = (params) =>
  post(`/file/download`, params, {
    responseType: 'blob',
  })
