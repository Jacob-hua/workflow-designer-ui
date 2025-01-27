import { post, get } from './unit/request'

// 工作流历史 列表

export const historyTaskList = (params) => post('/history/taskList', params)

// 累计工作流
export const postHistoryProcessCountStatistic = (params) => post('/execute/historyProcessCountStatistic', params)

export const listHistoryTask = (params) => post('/history/newTaskList', params)

export const getHistoryTaskDetail = (params) => get('/history/historyDetail', params)

export const exportDetail = (params) => post('/report/proccess/export-detail', params, {
  responseType: 'blob',
})

export const exportDetailMutil = (params) => post('/report/proccess/export-detail/mutil', params, {
  responseType: 'blob',
})
