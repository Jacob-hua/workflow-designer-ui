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
    configurationInfo: {
      listenerType: {
        class: {
          label: "Java 类",
          value: "Java 类",
        },
        expression: {
          label: "表达式",
          value: "表达式",
        },
        delegateExpression: {
          label: "代理表达式",
          value: "代理表达式",
        },
        script: {
          label: "脚本",
          value: "脚本",
        },
      },
      eventType: {
        create: {
          label: "创建",
          value: "创建",
        },
        assignment: {
          label: "指派",
          value: "指派",
        },
        complete: {
          label: "完成",
          value: "完成",
        },
        delete: {
          label: "删除",
          value: "删除",
        },
        update: {
          label: "更新",
          value: "更新",
        },
        timeout: {
          label: "超时",
          value: "超时",
        },
      },
      fieldType: {
        string: {
          label: "字符串",
          value: "字符串",
        },
        expression: {
          label: "表达式",
          value: "表达式",
        },
      },
    },
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
      refreshBpmnState(newSelection[0].businessObject);
    } else {
      refreshBpmnState(generateState())
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
