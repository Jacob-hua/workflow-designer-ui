import { get, post } from "./unit/request";

export const saveModel = (params) => post('/workflow/design/model/save',params)

export const updateModel = (params) => post('/workflow/design/model/update', params)

export const deleteModel = (params) => post('/workflow/design/model/delete', params)

export const fetchModelList = (params) => post('/workflow/design/model/list', params)

export const fetchModelInfo = (params) => get('/workflow/design/model/get', params)