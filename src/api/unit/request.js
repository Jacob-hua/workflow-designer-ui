import axios from 'axios'
import { Message } from 'element-ui'
import {router} from '../../main'

// create an axios instance
export const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  // timeout: 10000, // request timeout
})

axios.defaults.withCredentials = false

service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8' //设置编码

let count = 0;

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
    config.headers['Workflow-Platform-Authorization'] = 'R7P+1X8OQrdDGO6B+G4ZkRHtp1DTIZdvq+aNXa9UR5hViubDu7zIgbThItXx9xQnxG2ZFmYPzr4W0BLZDHww17BVnErrU8etYZPMRdJCArvNYvgPbpDocH6xaOoq+XlGd4germfwf3CcovUg+WFs6wWB4vtSSJVvNZYihnHLbxyVRWtoCjljS8IZkb9GONCdh0FBHP2rzWLOIaY794mclbbUWQ1mW3YIIVLFiRrf6fstpCTSZVZ7N+0K7uo0IV/6s//PmFWwVe6ELiCpBfXjUM6Ri1NOb46WQZksIFX+kggR/V+mIbEE/+cM+RNQXcnKVEJDmpAnfByAzd34d8eZ6UtmujQOGL3Y5rAJRRKXD3WakSYBGMLrv2wC0Lz0ckmUepH09co4C/uHyddds+sE/8nmb2y4vXFIpnj9hLyyU7+Zvh2or/FBP4UsuIHK0uG5U/e0tC+siEphsXq2ZR9jwNrvIHF0UnshnG7D67duOEXSUNhCoLKJfnrhLEMKF+rulHtnljRURyAlqMgo929HoWQYnM3kDcrgfo9giyRp7pZyq87xjNch6ylIKOK0qYIGWmnG9KArJRLyIeo345j5YKeIls1OdfHyGBERZp7LvDbB44H4KiIb31U2dkHpDx9nwBuUYx6I3bWXVFaKdPKxRr4iRylWsMvZgegi5pLzW2Xvak6NCn4VbiK3Zqj3KepTl/6rsgQJY3GPDlzmfwNhsO9qTo0KfhVuIrdmqPcp6lOwr5qZbkyflBbFn+xEVgWVjkIf0y30TiwlyURiWCbLhX1jKxlfYpizH3Uzl4DImpvANJdxlXrXc+bak/TXcz+agQhCO4GgomuvxlRmyX/a34vKeCBu3EneCmX5jaQYH5+8OrQbnwedEMkQmbTSWGwrHaSvDd61//TcAHzpLIbGejczr6TBEA3mH8WYFH3BWtFY4td9P/0eebVPxyMFwySLcuZoxcPUDdYrA29cn4BRK08lvaqrUP0ZO4liG+XiYHr+2K/KmNDhwrlLc/Vp0lGqAYfWPJbwXtUFzUPc8Pn4prKREKq1bC/Mk3WdLWXjBbDkt2HbDtT1IP/WEFCnaYXM9kA9prw/ULjSoL1qmzx9xMN2eMyFI6Hvs4oYFzT1BudiJhwx+BKFRdpKndZiYf/VTYABLmiqEVVbEnvjbB+gjkkDDiKWrS3Io+Qu5ujH2eSXjOHeeyllIcVRET3Ls0uK+XdQqS2mHoZ6zdyUIVyYnN3mZxhIVUOTZ+f6SySSQJEHQQx07zV2TqJO0pI80FuHKH1pFFR6zgVoW06JKAA+K7lVoLTMxjQ8TaL/BXhh/NMemtva/huAqkBgiyF/d5JCtDdMThpBXCzwJMideh2482Tfp24hkx4ey8tqY/1VV8WqbRHKhPjhpr+bk56mNm5jnws03Jh4byV+uEcQY8tsmvg16yp1zC0QUOW0L0ZCT6z4JQT/oY/Uii+nXKW1MBBD5oCJvDhsT8QUQd+fEVjIIg=='
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
      if (res.errorInfo && res.errorInfo.errorCode) {
        if (response.config.url !== '/config/global/executeApi') {
          Message({
            type: 'error',
            message: res.errorInfo.errorMsg,
          })
        }
        reject(res)
      }
      if (status === 200) {
        count = 0;
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
        if (error.response.config.url === '/config/global/executeApi') {
          Message.warning('您所配置的第三接口有误')
          return
        }
        Message({
          type: 'error',
          message: '未找到远程服务器',
        })
        break
      case 401:
        if(count === 0){
          sessionStorage.clear();
          Message({
            type: 'warning',
            message: '会话已过期，请重新登录',
          })
          router.push('/login');
        }
        count++;
        break
      default:
        Message({
          type: 'error',
          message: data.errorInfo.errorMsg??data.msg,
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
