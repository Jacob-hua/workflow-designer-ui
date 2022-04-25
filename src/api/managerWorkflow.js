import {
    get,
    post,
    deletefn
} from '../unit/request'

// 查询工作流草稿或发布流程

export const workFlowRecord = (params) =>
    post('/design/processDesignService/record', params);
