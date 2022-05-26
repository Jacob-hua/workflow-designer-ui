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

const getter = {};

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
};

const actions = {};

export const iBpmnListener = {
  "selection.changed": ({ newSelection }, refreshBpmnState) => {
    if (Array.isArray(newSelection) && newSelection[0]) {
      refreshBpmnState({
        name: newSelection[0].name,
      });
    }
  },
  "shape.changed": ({ element }, refreshBpmnState) => {
    if (element) {
      refreshBpmnState(element.businessObject);
    }
  },
};

export default {
  namespaced: true,
  state,
  getter,
  mutations,
  actions,
};
