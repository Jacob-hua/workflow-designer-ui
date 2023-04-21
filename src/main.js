// 微前端
import './public-path'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import routes from './router'
import VueRouter from 'vue-router'
import stores from './store'
import axios from 'axios'
import { getMappingName } from '@/util/date.js'
import { generateUUID } from '@/util/uuid.js'
Vue.prototype.$axios = axios
Vue.prototype.$getMappingName = getMappingName
Vue.prototype.$generateUUID = generateUUID

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import JsonViewer from 'vue-json-viewer'

import { Bpmn, FormPlugin } from './plugin'
// 引入 actions 实例
import actions from '@/util/qiankunActions.js'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(JsonViewer)
Vue.use(FormPlugin)
Vue.use(Bpmn)

import '@/directive/RoleDirective.js'

Vue.use(Vuex)
let router = null
let instance = null
function render(props = {}) {
  const { container } = props
  if(container) {
    actions.setActions(props)
  }
  router = new VueRouter({
    // base: window.__POWERED_BY_QIANKUN__ ? '/ftkms-gdgl/#/' : '/',
    mode: 'hash',
    routes
  })
  instance = new Vue({
    router,
    stores,
    render: (h) => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app')
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {
  console.log('[vue] vue app bootstraped')
}
export async function mount(props) {
  console.log('[vue] props from main framework', props)
  render(props)
}
export async function unmount() {
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
  router = null
}
