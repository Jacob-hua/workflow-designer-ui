import { onCommandStackChanged } from "../listener";

const state = {
  undoable: false,
  redoable: false,
};

const getters = {};

const mutations = {};

const actions = {};

const eventsListener = {
  "commandStack.changed": onCommandStackChanged,
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  eventsListener,
};
