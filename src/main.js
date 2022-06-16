import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import router from "./router";
import stores from "./store";
import axios from "axios";
import { getMappingName } from '@/util/date.js'
Vue.prototype.$axios = axios;
Vue.prototype.$getMappingName = getMappingName;

import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/plugin/package/theme/element-variables.scss";
import JsonViewer from "vue-json-viewer";

import { Bpmn, FormPlugin } from "./plugin";
import { bpmnVuexPlugin } from "./plugin/Bpmn";

import "./assets/iconfont/iconfont.js";

import { vuePlugin } from "@/plugin/package/highlight";
import "highlight.js/styles/atom-one-dark-reasonable.css";

import MyPD from "@/plugin/package/index.js";
import "@/plugin/package/theme/index.scss";

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(JsonViewer);
Vue.use(FormPlugin);
Vue.use(Bpmn, {
  type: "camunda",
  lintActive: true,
});

Vue.use(vuePlugin);

Vue.use(MyPD);
import "@/directive/RoleDirective.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: stores,
  plugins: [bpmnVuexPlugin],
});
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
