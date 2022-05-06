import {
  get,
  post,
  deletefn,
  put,
  service
} from './request'


// api接口查询
export const apiCascade = (params) =>
  get('/config/global/apiCascade', params);

export const extraApi = (params) =>
  post('/config/global/executeApi', params);

export const processInstanceData = (params) =>
  get('/process/processInstanceData', params);

export const postFormService = (params) =>
  post('/formService', params);
  
export const getFormService = (params) =>
  get('/design/formService/page', params);
  
// 不用
export const getProcessDesignService = (params) =>
  get('/design/processDesignService/page', params);


// 正式接口

// 工作流保存
export const postProcessDesignService = (params) =>
  post('/design/processDesignService', params);
  
// 保存草稿表单
export const postFormDesignService = (params) =>
  post('/design/formDesignService', params);

// 发布到可用表单
export const postFormDesignServiceRealiseProcessData = (params) =>
  post('/design/formDesignService/realiseFormData', params);

// 查询可用表单
export const postFormDesignBasicFormRecord = (params) =>
  post('/design/formDesignService/basicFormRecord', params);

// 查询草稿箱表单
export const postFormDesignRecordDraftInfo = (params) =>
  post('/design/formDesignService/formDesignRecordDraftInfo', params);
  
// 查询表单详情
export const postFormDesignRecordFormDesignRecordInfo = (params) =>
  post('/design/formDesignService/formDesignRecordInfo', params);
  
// 删除表单
export const deleteFormDesignService = (id) =>
  deletefn('/design/formDesignService/' + id);
  
//查询所有表单
export const designFormDesignServiceAll = (params) =>
  post('/design/formDesignService/all', params);

// 工作流

// 发布工作流
export const postDesignDesignService = (params) =>
  post('/design/processDesignService/realiseProcessData', params);

// 查询驾驶舱工作流信息
export const postProcessDesignServicePage = (params) =>
  post('/design/processDesignService/page', params);
  
// 查询驾驶舱草稿箱信息
export const postDraftlist = (params) =>
  post('/process/draft/list', params);
  
// 保存到草稿箱
export const postProcessDraft = (params) =>
  post('/process/draft', params);

// 部署时草稿列表
export const getProcessDraftList = (params) =>
  post('/process/draft/list', params);

// 删除草稿列表
export const deleteDraft = (id) =>
  deletefn('/process/draft/' + id);

// 部署工作流
export const postDeployForOnline = (params) =>
  post('/process/deploy/deployForOnline', params);
  
// 根据流程获取部署列表
export const getDeployBasic = (id) =>
  get('/process/deploy/basic/' + id);
  
// 查询工作流详情
export const getDeployAndProcessInfo = (id) =>
  get('/process/deploy/deployAndProcessInfo/' + id);
  
// 删除部署列表
export const getDeleteDeployment = (params) =>
  deletefn('/process/deploy/deleteDeployment', params);

// api类型下拉框
export const getApiTypeList = (params) =>
  get('/config/global/apiTypeList', params);

// 执行时

// 可创建实例列表
export const getProcessDefinitionList = (params) =>
  get('/execute/processDefinitionList', params);
  
// 启动流程实例
export const getStartProcess = (params) =>
  post('/execute/startProcess', params);
  
// 用户任务列表
export const getTaskList = (params) =>
  post('/execute/taskList', params);
  
// 任务详情列表
export const getTaskTrackList = (params) =>
  get('/execute/taskDetailList', params);
  
// 任务流程最详情列表
export const getTaskDetailList = (params) =>
  get('/execute/taskTrackList', params);
  
// 任务执行
export const postCompleteTask = (params) =>
  post('/execute/completeTask', params);

// 查询用户
export const getPersonUser = (params) =>
  post('/person/pageUser', params);

// 获取第三方组织架构
export const getThreeSystemOrganize = (params) =>
  get('/person/systemOrganize', params);
  
// 挂起流程
export const putHangInstance = (params) =>
  get('/execute/hangInstance', params);

// 用户验证
export const postVerifyUser = (params) =>
  post('/person/verifyUser', params);
  
// 驳回流程
export const putRejectTask = (params) =>
  put('/execute/rejectTask', params);
  
// 终止流程
export const putCancelInstance = (params) =>
  put('/execute/cancelInstance', params);
  
// 传阅流程
export const getCirculation = (params) =>
  get('/execute/circulation', params);
  
// 流程加减签
export const getModifyProcessUser = (params) =>
  get('/execute/modifyProcessUser', params);
  
// 代办流程
export const getModifyCandidate = (params) =>
  get('/execute/modifyCandidate', params);

// 重新激活流程
export const getActiveInstance = (params) =>
  get('/execute/activeInstance', params);
  
// 登录接口
export const userLogin = (params) =>
  get('/person/login', params);
