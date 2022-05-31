import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "@/components/package/theme/element-variables.scss";

import JsonViewer from 'vue-json-viewer'

Vue.use(ElementUI);
Vue.use(JsonViewer);

import { vuePlugin } from "@/components/package/highlight";
import "highlight.js/styles/atom-one-dark-reasonable.css";
Vue.use(vuePlugin);

import MyPD from "@/components/package/index.js";
Vue.use(MyPD);
import "@/components/package/theme/index.scss";
import "@/directive/RoleDirective.js"


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
