import config from "./config";

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

const getters = {};

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
  addListener(state, listener = {}) {
    listener.id = state.listeners.length;
    state.listeners = [...state.listeners, listener];
  },
  updateListener(state, newListener = {}) {
    state.listeners = state.listeners.map((listener) => {
      return listener.id === newListener.id ? newListener : listener;
    });
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
