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

// 查询字典列表
export const getDictionaryList = (params) => post('/workflow/system/dict/list/parent',params)

// 新增字典
export const addDictionaryItem = (params) => post('/workflow/system/dict/add/parent',params)

// 编辑字典
export const editDictionaryItem = (params) => post('/workflow/system/dict/update/parent',params)

// 删除字典
export const deleteDictionaryItem = (params) => get('/workflow/system/dict/delete/parent',params)

// 查询一个字典下所有枚举信息
export const getDictionaryItemEnum = (params) => post('/workflow/system/dict/list/childs',params)

// 新增枚举 /workflow/system/dict/add/child
export const addEnumItem = (params) => post('/workflow/system/dict/add/child',params)

// 编辑枚举 /workflow/system/dict/update/child
export const editEnumItem = (params) => post('/workflow/system/dict/update/child',params)

// 删除枚举 /workflow/system/dict/delete/child
export const deleteEnumItem = (params) => get('/workflow/system/dict/delete/child',params)
