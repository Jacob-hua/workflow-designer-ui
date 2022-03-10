import {
  get,
  post
} from './request'

export const apiCascade = (params) =>
  get('/config/global/apiCascade', params);

export const extraApi = (params) =>
  get('/process/extraApi', params);

export const processInstanceData = (params) =>
  get('/process/processInstanceData', params);

export const postFormService = (params) =>
  post('/formService', params);