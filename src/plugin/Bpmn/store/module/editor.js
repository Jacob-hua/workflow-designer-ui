import { editor as editorListener } from "../listener";

const state = {
  undoable: false,
  redoable: false,
};

const getters = {};

const mutations = {};

const actions = {};

const eventsListener = {
  "commandStack.changed": editorListener.onCommandStackChanged,
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  eventsListener,
};
