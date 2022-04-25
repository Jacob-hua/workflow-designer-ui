import axios from "axios"
import {Message} from 'element-ui'

// create an axios instance
export const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

axios.defaults.withCredentials = true

service.defaults.headers['X-SIACT-TOKEN'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImFkbWluIiwiZXhwIjoxNjYzNDcyNjQ4fQ.gGidbfs64pf_r79KFGdUHtCkEJdU5JtficHEh1K112U'
service.defaults.headers['X-SIACT-TOKEN-TYPE'] = '1'


service.defaults.headers.post["Content-Type"] ="application/x-www-form-urlencoded;charset=UTF-8";  //设置编码



//请求拦截
service.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
)
//响应拦截
service.interceptors.response.use(
  response => {
    return new Promise (
      (resolve, reject) => {
        const status = response.status;
        const res = response.data
        if (status === 200) {
          resolve(res);
        } else {
          reject(res);
        }
      }
    )
  },
  error => {
      //断网处理或者请求超时
    if (!error.response) {
      //请求超时
      if (error.message.includes("timeout")) {
        Message({
          type:'error',
          message:"请求超时，请检查互联网连接"
        })
      } else {
        //断网，可以展示断网组件
        Message({
          type:'error',
          message:"请检查网络是否已连接"
        })
      }
      return;
    }
    const status = error.response.status;
    switch (status) {
      case 500: 
        Message({
          type:'error',
          message:"操作失败"
        })
        break;
      case 404:
        Message({
          type:'error',
          message:"未找到远程服务器"
        })
        break;
      default:
        Message({
          type:'error',
          message:"请求失败"
        })
    }
    return Promise.reject(error);
  }
)

export function get(url, params, config) {
  return service.get(url, {params,config})
}

export function post(url, params) {
  return service.post(url, params)
}
export function put(url, params) {
  return service.put(url, params)
}

export function deletefn(url, params, config) {
  return service.delete(url, {params, config})
}