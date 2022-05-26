const state = {
  name: "",
};

const getter = {};

const mutations = {
  refreshStore(state, payload = {}) {
    Object.keys(payload).forEach((key) => {
      state[key] = payload[key];
    });
  },
};

const actions = {};

export const iBpmnListener = {
  "selection.changed": ({ newSelection }, refreshBpmnState) => {
    if (Array.isArray(newSelection) && newSelection[0]) {
      refreshBpmnState({
        name: newSelection[0].id,
      });
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
