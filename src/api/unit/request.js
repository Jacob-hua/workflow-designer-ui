import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'

// create an axios instance
export const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
})

axios.defaults.withCredentials = true

service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8' //设置编码

//请求拦截
service.interceptors.request.use(
  (config) => {
    if (config.url === '/execute/processResource') {
      return config
    }
    config.headers['X-SIACT-SOURCE'] = 'PC'
    let userInfo = (sessionStorage.getItem('loginData') && JSON.parse(sessionStorage.getItem('loginData'))) || ''
    if (userInfo) {
      config.headers['X-SIACT-TOKEN'] = userInfo.token
      config.headers['X-SIACT-TOKEN-TYPE'] = '1'
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
//响应拦截
service.interceptors.response.use(
  (response) => {
    return new Promise((resolve, reject) => {
      const status = response.status
      const res = response.data
      if (status === 200) {
        resolve(res)
      } else {
        reject(res)
      }
    })
  },
  (error) => {
    //断网处理或者请求超时
    if (!error.response) {
      //请求超时
      if (error.message.includes('timeout')) {
        Message({
          type: 'error',
          message: '请求超时，请检查互联网连接',
        })
      } else {
        //断网，可以展示断网组件
        Message({
          type: 'error',
          message: '请检查网络是否已连接',
        })
      }
      return
    }
    const status = error.response.status
    const data = error.response.data
    switch (status) {
      case 500:
        Message({
          type: 'error',
          message: '操作失败',
        })
        break
      case 404:
        Message({
          type: 'error',
          message: '未找到远程服务器',
        })
        break
      case 401:
        sessionStorage.clear()
        router.push('/')
        break
      default:
        Message({
          type: 'error',
          message: data.errorInfo.errorMsg,
        })
    }
    return Promise.reject(error)
  }
)

export function get(url, params, config) {
  return service.get(url, { params, ...config })
}

export function post(url, params, config) {
  return service.post(url, params, config)
}
export function put(url, params) {
  return service.put(url, params)
}

export function deletefn(url, data) {
  return service({
    url: url,
    method: 'delete',
    data: data,
  })
}
