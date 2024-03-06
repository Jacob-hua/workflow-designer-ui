import {get,post} from './unit/request'

//获取流程列表
export const fetchWorkflowList = (params) => post('/workflow/design/process/list',params)

//删除流程
export const deleteWorkflow = (params) => get('/workflow/design/process/delete',params)

//新增流程
export const saveWorkflow = (params) => post('/workflow/design/process/save',params)

//更新流程
export const updateWorkflow = (params) => post('/workflow/design/process/update',params)

//公共流程绑定关联
export const bindWorkflow = (params) => post('/workflow/design/process/bind',params)

//获取流程信息
export const getWorkflowInfo = (params) => get('/workflow/design/process/get',params)

