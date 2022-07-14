import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
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

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(JsonViewer)
Vue.use(FormPlugin)
Vue.use(Bpmn)

import '@/directive/RoleDirective.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: stores,
})
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
