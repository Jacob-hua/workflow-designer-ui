import { deepCopy } from "../../utils/object";

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
  eventOptions: [
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
  userGroupOptions: [],
  userOptions: [],
  loopCharacteristicsOptions: [
    {
      label: "并行多重事件",
      value: "ParallelMultiInstance",
    },
    {
      label: "时序多重事件",
      value: "SequentialMultiInstance",
    },
  ],
  userTaskActionButtons: ["待办", "传阅", "挂起", "驳回", "终止"],
  multiInstanceActionButtons: ["待办", "传阅", "挂起", "加减签", "驳回", "终止"],
  requestUserGroupFunc: () => {},
  requestUserFunc: () => {},
  generateIdFunc: () => {},
};

const getters = {
  listenerTypeLabel(state) {
    return ({ listenerType }) => {
      return state.listenerTypeOptions.find(({ value }) => value === listenerType)?.label;
    };
  },
  eventLabel(state) {
    return ({ event }) => {
      return state.eventOptions.find(({ value }) => value === event)?.label;
    };
  },
  fieldTypeLabel(state) {
    return ({ fieldType }) => {
      return state.fieldTypeOptions.find(({ value }) => value === fieldType)?.label;
    };
  },
  variableTypeLabel(state) {
    return ({ type }) => {
      return state.variableTypeOptions.find(({ value }) => value === type)?.label;
    };
  },
  findUserGroupChildren(state) {
    return ({ value }) => {
      return state.userGroupOptions.find((option) => option.value === value)?.children;
    };
  },
  actionButtons(state) {
    return ({ loopCharacteristics }) => {
      return loopCharacteristics ? state.multiInstanceActionButtons : state.userTaskActionButtons;
    };
  },
};

const mutations = {
  updateUserOptions(state, { newUserOptions = [] }) {
    state.userOptions = deepCopy(newUserOptions);
  },
  updateUserGroupOptions(state, { newUserGroupOptions = [] }) {
    state.userGroupOptions = deepCopy(newUserGroupOptions);
  },
  updateRequestUserFunc(state, { newFunc = () => {} }) {
    state.requestUserFunc = newFunc;
  },
  updateRequestUserGroupFunc(state, { newFunc = () => {} }) {
    state.requestUserGroupFunc = newFunc;
  },
  updateGenerateIdFunc(state, { newFunc = () => {} }) {
    state.generateIdFunc = newFunc;
  },
};

const actions = {
  async dispatchRequestUser({ commit, state: { requestUserFunc } }, payload) {
    const res = await Promise.resolve(requestUserFunc(payload));
    commit("updateUserOptions", { newUserOptions: res });
    return res;
  },
  async dispatchRequestUserGroup({ commit, state: { requestUserGroupFunc } }, payload) {
    const res = await Promise.resolve(requestUserGroupFunc(payload));
    commit("updateUserGroupOptions", { newUserGroupOptions: res });
    return res;
  },
  async dispatchGenerateId({ state: { generateIdFunc } }, payload) {
    const res = await Promise.resolve(generateIdFunc(payload));
    return res ?? new Date().getTime().toString();
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
