import { get, post } from './unit/request'

// 查询分组列表
export const getGroupList = (params) => post('/workflow/system/api/list/group',params)

// 新增分组
export const addGroupItem = (params) => post('/workflow/system/api/add/group',params)

// 修改分组 /workflow/system/api/update/group
export const editGroupItem = (params) => post('/workflow/system/api/update/group',params)

// 删除分组 /workflow/system/api/delete/group
export const deleteGroupItem = (params) => get('/workflow/system/api/delete/group',params)

// 查询接口列表
export const getApiList = (params) => post('/workflow/system/api/list/conf',params)

// 新增接口 /workflow/system/api/add/conf
export const addApiList = (params) => post('/workflow/system/api/add/conf',params)

// 更新接口 /workflow/system/api/update/conf
export const updateApiItem = (params) => post('/workflow/system/api/update/conf',params)

// 删除接口 /workflow/system/api/delete/conf
export const deleteApiItem = (params) => get('/workflow/system/api/delete/conf',params)

// 执行接口 /workflow/system/api/execute/conf
export const getApiResponse = (params) => post('/workflow/system/api/execute/conf',params)
