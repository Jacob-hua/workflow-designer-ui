import {
    post
} from './unit/request'

// 工作流历史 列表

export const historyTaskList = (params) =>
    post('/history/taskList', params);

// 累计工作流
export const postHistoryProcessCountStatistic = (params) =>
    post('/history/historyProcessCountStatistic', params);