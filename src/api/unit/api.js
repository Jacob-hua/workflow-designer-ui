import { get, post, deletefn, put, service } from './request'

// api接口查询
export const apiCascade = (params) => get('/config/global/apiCascade', params)

export const extraApi = (params) => post('/config/global/executeApi', params)

export const processInstanceData = (params) => get('/process/processInstanceData', params)

export const postFormService = (params) => post('/formService', params)

export const getFormService = (params) => get('/design/formService/page', params)

// 不用
export const getProcessDesignService = (params) => get('/design/processDesignService/page', params)

// 正式接口

// 工作流保存
export const postProcessDesignService = (params) => post('/design/processDesignService/create', params)

// 保存草稿表单
export const postFormDesignService = (params) => post('/design/formDesignService/create', params)

// 修改草稿表单
export const putFormDesignService = (params) => put('/design/formDesignService/update', params)

// 发布到可用表单
export const postFormDesignServiceRealiseProcessData = (params) =>
  post('/design/formDesignService/realiseFormData', params)

// 关联表单
export const associationForm = (params) => post('/design/formDesignService/associationForm', params)

// 查询可用表单
export const postFormDesignBasicFormRecord = (params) => post('/design/formDesignService/basicFormRecord', params)

// 查询草稿箱表单
export const postFormDesignRecordDraftInfo = (params) =>
  post('/design/formDesignService/formDesignRecordDraftInfo', params)

// 查询表单详情
export const postFormDesignRecordFormDesignRecordInfo = (params) =>
  post('/design/formDesignService/formDesignRecordInfo', params)

// 删除表单
export const deleteFormDesignService = (params) => deletefn('/design/formDesignService/delete', params)

//查询所有表单
export const designFormDesignServiceAll = (params) => post('/design/formDesignService/all', params)

// 工作流

// 发布工作流
export const postDesignDesignService = (params) => post('/design/processDesignService/realiseProcessData', params)

// 查询驾驶舱工作流信息
export const postProcessDesignServicePage = (params) => post('/design/processDesignService/page', params)

// 查询驾驶舱草稿箱信息
export const postDraftlist = (params) => post('/process/draft/list', params)

// 保存到草稿箱
// export const postProcessDraft = (params) =>
//   post('/process/draft', params);

// 保存草稿
export const postProcessDraft = (params) => post('/process/draft/create', params)

// 修改草稿
export const putProcessDraft = (params) => put('/process/draft/update', params)

// 部署时草稿列表
export const getProcessDraftList = (params) => post('/process/draft/list', params)

// 删除草稿列表
export const deleteDraft = (id) => deletefn('/process/draft/delete', { id: id })

// 部署工作流
export const postDeployForOnline = (params) => post('/process/deploy/deployForOnline', params)

// 根据流程获取部署列表
export const getDeployBasic = (params) => get('/process/deploy/basic', params)

// 查询工作流详情
export const getDeployAndProcessInfo = (id) => get('/process/deploy/deployAndProcessInfo/' + id)

// 删除部署列表
export const getDeleteDeployment = (params) => deletefn('/process/deploy/deleteDeployment/delete', params)

// api类型下拉框
export const getApiTypeList = (params) => get('/config/global/apiTypeList', params)

// 周期性规则列表
export const getCycleRuleList = (params) => get('/periodicity/list', params)

// 执行时

export const getDeployNameList = (params) => get('/process/deploy/deployNameList', params)

// 获取执行时工作流详情
export const getExecuteDetail = (params) => get('/execute/executeDetail', params)

// 获取执行时工作流列表
export const getExecuteList = (params) => post('/execute/executeList', params)

// 可创建实例列表
export const getProcessDefinitionList = (params) => get('/execute/processDefinitionList', params)

// 启动流程实例
export const getStartProcess = (params) => post('/execute/startProcess', params)

// 用户任务列表
export const getTaskList = (params) => post('/execute/taskList', params)

// 用户流程任务列表（新）
export const getNewTaskList = (params) => post('/execute/newTaskList', params)

// 任务详情列表
export const getTaskTrackList = (params) => get('/execute/taskDetailList', params)

// 任务流程最详情列表
export const getTaskDetailList = (params) => get('/execute/taskTrackList', params)

// 任务执行
export const postCompleteTask = (params) => post('/execute/completeTask', params)

// 查询用户
export const getPersonUser = (params) => post('/person/pageUser', params)

// 获取第三方组织架构
export const getThreeSystemOrganize = (params) => get('/person/systemOrganize', params)

// 挂起流程
export const putHangInstance = (params) => get('/execute/hangInstance', params)

// 用户验证
export const postVerifyUser = (params) => post('/person/verifyUser', params)

// 驳回流程
export const putRejectTask = (params) => put('/execute/rejectTask', params)

// 终止流程
export const putCancelInstance = (params) => put('/execute/cancelInstance', params)

// 传阅流程
export const getCirculation = (params) => get('/execute/newCirculation', params)

// 流程加减签
export const getModifyProcessUser = (params) => get('/execute/modifyProcessUser', params)

// 流程加减签（新）
export const postModifyProcessUser = (params) => post('/execute/modifyProcessUser', params)

// 代办流程
export const getModifyCandidate = (params) => get('/execute/modifyCandidate', params)

// 重新激活流程
export const getActiveInstance = (params) => get('/execute/activeInstance', params)

// 登录接口
export const userLogin = (params) => get('/person/login', params)

// 执行中工作流统计
export const getTaskCountStatistic = (params) => post('/execute/processCountStatistic', params)

// 统计已部署工作流
export const getDeployCount = (params) => post('/process/deploy/deployCount', params)

// 用户流程任务数量统计
export const postTaskCountStatistics = (params) => post('/execute/taskCountStatistics', params)

// 获取下一步流程的信息
export const getProcessNodeInfo = (params) => get('/execute/processNodeInfo', params)

// 上传文件
export const uploadTaskAttachmentFile = (params) => post('/execute/taskAttachment', params)

// 文件下载
export const downloadTaskAttachmentFile = (params) =>
  get('/execute/taskAttachmentDownload', params, {
    responseType: 'blob',
  })

// 流程图详情
export const postProcessResource = (params) => post('/execute/processResource', params)

// 权限管理

// 获取组树
export const getSystemGroupTree = (params) => get('/person/systemGroupTree', params)

// 获取用户列表
export const postPersonUser = (params) => post('/person/user', params)

// 查询用户资源权限
export const getUserPermission = (params) => get('/permission/mapping/userPermission', params)

// 保存权限
export const postMapping = (params) => post('/permission/mapping', params)

// 查询组资源权限
export const getGroupPermission = (params) => get('/permission/mapping/groupPermission', params)

//人员权限编辑
export const mappingUser = (params) => post('/permission/mapping/user', params)
export const mappingGroup = (params) => post('/permission/mapping/group', params)

export const queryAddressInfo = (params) => post('/assembly/queryAddressInfo', params)

// 获取启动项表单
export const getSelectStartForm = (params) => get(`/config/startConfig/selectProcessStartFormByNoDeployId`, params)

export const getSpareList = (params) => get('/inventoryfac/list',params)

export const checkStockAndUse = (params) => post('./inventoryfac/checkStockAndUse',params)
export const checkStock = (params) => post('./inventoryfac/checkStock',params)

export const cancleStock = (params) => get('/inventoryfac/cancle',params)

export const cancleWithSort = (params) => post('/inventoryfac/cancleWithSort',params)

export const getSpareListByPage = (params) => post('./inventoryfac/page',params)
