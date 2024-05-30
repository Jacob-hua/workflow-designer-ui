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

const createRouter = () => {
  const router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? '/ftkms-gdgl/' : '/',
    mode: 'history',
    routes,
  })
  // router.beforeEach((to, from, next) => {
  //   try {
  //     if (['login', 'noPermission', 'WorkflowViewer'].includes(to.name)) {
  //       next()
  //       return
  //     }
  //     let routerName = to.name

  //     let { menuProjectList } = JSON.parse(sessionStorage.getItem('loginData'))

  //     if (!menuProjectList) {
  //       next('/home/noPermission')
  //       return
  //     }

  //     let menuList = menuProjectList.filter((item) => {
  //       return item.projectList.length > 0
  //     })

  //     let findEle = menuList.findIndex((item) => {
  //       return item.menuRoute === routerName
  //     })
  //     if (findEle === -1) {
  //       // TODO: 在没有权限的时候应该抛出响应的无权限提示
  //       // next('/home/noPermission')
  //       next('/home/noPermission')
  //     } else {
  //       next()
  //     }
  //   } catch (error) {
  //     next('/login')
  //   }
  // })
  return router
}

export let router = createRouter()

const store = new Vuex.Store({
  modules: stores,
})

let instance = null
function render(props = {}) {
  const { container } = props
  if (container) {
    actions.setActions(props)
  }
  if (!router) {
    router = createRouter()
  }
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
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
