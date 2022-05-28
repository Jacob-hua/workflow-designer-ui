import config from "./config";
import { isEmptyArray } from "../../utils/array";

function generateState() {
  return {
    name: "",
    versionLabel: "",
    isImplement: false,
    /**
     * newsItem: {
     *  newsId: "",
     *  newsName: "",
     * }
     */
    news: [],
    /**
     * signalsItem: {
     *  signalId: "",
     *  signalName: "",
     * },
     */
    signals: [],
    /**
     * listenersItem: {
     *    listenerId: "",
     *    eventType: "",
     *    listenerType: "",
     *    fields: [
     *      {
     *        fieldName: "",
     *        fieldType: "",
     *        fieldValue: "",
     *      },
     *  ],
     * }
     */
    listeners: [],
    /**
     * extendProperties: {
     *  propertyName: "",
     *  propertyValue: "",
     * }
     */
    extendProperties: [],
    configBtton: [],
    elementText: "",
  };
}

const state = generateState();

const getters = {
  findListenerByIndex(state) {
    return (index) => {
      // 为了保证数据是单向流动的，这里需要将匹配的对象重新解构为新的对象
      // 这样做的目的是防止Vue响应式的双向数据绑定会直接修改state中的数据
      return { ...(state.listeners[index] ?? {}) };
    };
  },
};

const mutations = {
  initState() {
    this.commit("bpmn/refreshBpmnState", generateState());
  },
  refreshBpmnState(state, payload = {}) {
    Object.keys(payload).forEach((key) => {
      state[key] = payload[key];
    });
  },
  updateName(state, name) {
    state.name = name;
    this.$iBpmn.updateSelectedShapeProperties({ name });
  },
  addListener(state, { listener }) {
    if (isEmptyArray(Object.keys(listener))) {
      return;
    }
    state.listeners.push(listener);
  },
  updateListener(state, { index, newListener }) {
    if (!state.listeners[index] && isEmptyArray(Object.keys(newListener))) {
      return;
    }
    state.listeners.splice(index, 1, newListener);
  },
  removeListener(state, { index }) {
    if (!state.listeners[index]) {
      return;
    }
    state.listeners.splice(index, 1);
  },
};

const actions = {};

export const iBpmnListener = {
  "selection.changed": ({ newSelection }, refreshBpmnState) => {
    if (Array.isArray(newSelection) && newSelection[0]) {
      refreshBpmnState(newSelection[0].businessObject);
    } else {
      refreshBpmnState(generateState());
    }
  },
  "shape.changed": ({ element }, refreshBpmnState) => {
    if (element) {
      refreshBpmnState(element.businessObject);
    }
  },
};

export default {
  modules: {
    config,
  },
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
