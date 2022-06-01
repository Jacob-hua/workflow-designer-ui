const state = {
  listenerTypeOptions: [
    {
      label: "Java 类",
      value: "class",
    },
    {
      label: "表达式",
      value: "expression",
    },
    {
      label: "代理表达式",
      value: "delegateExpression",
    },
    {
      label: "脚本",
      value: "script",
    },
  ],
  eventTypeOptions: [
    {
      label: "创建",
      value: "create",
    },
    {
      label: "指派",
      value: "assignment",
    },
    {
      label: "完成",
      value: "complete",
    },
    {
      label: "删除",
      value: "delete",
    },
    {
      label: "更新",
      value: "update",
    },
    {
      label: "超时",
      value: "timeout",
    },
  ],
  scriptTypeOptions: [
    {
      label: "内联脚本",
      value: "inline",
    },
    {
      label: "外部脚本",
      value: "outside",
    },
  ],
  timerTypeOptions: [
    {
      label: "日期",
      value: "date",
    },
    {
      label: "持续时长",
      value: "duration",
    },
    {
      label: "循环",
      value: "cycle",
    },
    {
      label: "无",
      value: "null",
    },
  ],
  fieldTypeOptions: [
    {
      label: "字符串",
      value: "string",
    },
    {
      label: "表达式",
      value: "expression",
    },
  ],
  variableTypeOptions: [
    {
      label: "字符串或表达式",
      value: "string/expression",
    },
    {
      label: "脚本",
      value: "script",
    },
    {
      label: "列表",
      value: "list",
    },
    {
      label: "键值对",
      value: "map",
    },
  ],
};

const getters = {
  listenerTypeLabel(state) {
    return ({ listenerType }) => {
      return state.listenerTypeOptions.find(({ value }) => value === listenerType)?.label;
    };
  },
  eventTypeLabel(state) {
    return ({ eventType }) => {
      return state.eventTypeOptions.find(({ value }) => value === eventType)?.label;
    };
  },
  fieldTypeLabel(state) {
    return ({ fieldType }) => {
      return state.fieldTypeOptions.find(({ value }) => value === fieldType)?.label;
    };
  },
};

const mutations = {};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
