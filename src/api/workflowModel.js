import { get, post } from "./unit/request";

//保存模型配置信息
export const saveModel = (params) => post('/workflow/design/model/save',params)

//更新模型配置信息
export const updateModel = (params) => post('/workflow/design/model/update', params)

//删除模型配置信息
export const deleteModel = (params) => post('/workflow/design/model/delete', params)

//查询模型配置列表
export const fetchModelList = (params) => post('/workflow/design/model/list', params)

//查询指定模型配置
export const fetchModelInfo = (params) => get('/workflow/design/model/get', params)