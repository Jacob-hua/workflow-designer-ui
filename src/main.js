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
Vue.prototype.$EventBus = new Vue()

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'ant-design-vue/dist/antd.less'
import './assets/style/default.less'
import JsonViewer from 'vue-json-viewer'

import { Bpmn, FormPlugin } from './plugin'
// 引入 actions 实例
import actions from '@/util/qiankunActions.js'
import { prefetchApps } from 'qiankun'
import '@/directive/RoleDirective.js'
import VueCompositionAPI from '@vue/composition-api'
Vue.config.productionTip = false

Vue.use(VueCompositionAPI)
Vue.use(ElementUI)
Vue.use(JsonViewer)
Vue.use(FormPlugin)
Vue.use(Bpmn)

Vue.use(VueRouter)

Vue.use(Vuex)

prefetchApps([
  {name:'formDesigner', entry: `${process.env.QIAN_KUN_URL?process.env.QIAN_KUN_URL:'http://127.0.0.1:3000'}`}
])

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

const store = new Vuex.Store({
  modules: stores,
})

const createRouter = () => {
  const router = new VueRouter({
    base: window.__POWERED_BY_WUJIE__ ? '/meos-lcyq/' : '/',
    mode: 'hash',
    routes,
  })
  return router
}

export let router = createRouter()

let instance = null
function render() {
  if (!router) {
    router = createRouter()
  }
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app')
}

render()

window.__WUJIE_UNMOUNT = () => {
  instance.$destroy()
}
