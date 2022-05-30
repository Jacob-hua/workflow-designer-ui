import { isEmptyArray } from "../../utils/array";

const state = {
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
  updateName(state, name) {
    state.name = name;
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

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
