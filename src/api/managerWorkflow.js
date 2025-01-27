import { get, post, deletefn, put } from './unit/request'

// 查询工作流草稿或发布流程

export const workFlowRecord = (params) => post('/design/processDesignService/record', params)

// 统计数量
export const designProcessCountStatistics = (params) =>
  post('/design/processDesignService/designProcessCountStatistics', params)

// 工作流 草稿 新增

export const createWorkFlow = (params) => post('/design/processDesignService/create', params)

// 工作流 草稿 新增

export const updateWorkFlow = (params) => put('/design/processDesignService/update', params)

// 发布工作流
export const publishWorkflow = (params) => post('/design/processDesignService/realiseProcessData', params)

// 删除 工作流
export const deleteWorkflow = (params) => deletefn('/design/processDesignService/delete', params)

// 工作流引用统计
export const listWorkflowQuote = (params) => get('/design/processDesignService/quote', params)
