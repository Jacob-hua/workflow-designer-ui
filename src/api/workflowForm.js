import {get,post} from './unit/request'

//查询表单主体信息列表
export const fetchFormList = (params) => post('/workflow/design/form/list/info', params);

//查询表单版本信息列表
export const fetchFormVersionList = (params) => post('/workflow/design/form/list/version', params);

//新增表单版本信息
export const addFormVersion = (params) => post('/workflow/design/form/add/version', params);

//绑定公共表单至业务表单信息
export const bindCommonFormToBussiness = (params) => post('/workflow/design/form/bind', params);

//新增表单主体信息
export const addFormInfo = (params) => post('/workflow/design/form/create/info', params);

//更新表单主体信息
export const updateFormInfo = (params) => post('/workflow/design/form/update/info', params);

//删除表单主体信息
export const deleteFormInfo = (params) => get('/workflow/design/form/delete/info', params);

//删除表单版本信息
export const deleteFormVersion = (params) => post('/workflow/design/form/delete/version', params);

//查询表单版本信息
export const fetchFormVersion = (params) => get('/workflow/design/form/get/version', params);