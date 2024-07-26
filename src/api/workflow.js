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
export const fetchWorkflowInfo = (params) => get('/workflow/design/process/get',params)

//获取任务节点列表
export const fetchTaskNodeList = (params) => post('/workflow/design/process/task/before/list', params)

//统计流程总数和已部署数量
export const fetchDeployCount = (params) => post('/workflow/design/process/deploy/count', params)

// 获取取值组件字典信息
export const getDictData = (params) => get('/workflow/system/dict/get/childs', params)


