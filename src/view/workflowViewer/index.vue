<template>
  <div class="container">
    <bpmn-viewer
      :xml="xml"
      :prop="{
        bpmnRenderer: {
          defaultFillColor: 'none',
          defaultStrokeColor: '#666666',
          defaultLabelColor: '#666666',
        },
      }"
    />
  </div>
</template>

<script>
import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true,
  timeout: 10000,
})

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

const postProcessResource = (headers = {}, params = {}) => {
  service.defaults.headers = { ...service.defaults.headers, ...headers }
  return service.post('/execute/processResource', params)
}

export default {
  name: 'WorkflowViewer',
  data() {
    return {
      xml: '',
    }
  },
  mounted() {
    const req = new XMLHttpRequest()
    req.open('GET', document.location, false)
    req.send(null)
    this.fetchProcessResource(req.getAllResponseHeaders())
  },
  methods: {
    async fetchProcessResource(header) {
      try {
        const { errorInfo, result } = await postProcessResource(header, {
          processInstanceId: this.$route.params.processInstanceId,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }
        this.xml = result
      } catch (error) {}
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;
}
</style>
