const state = {
  organization: [],
};

const getters = {};

const mutations = {
  updateOrganization(state, { organization }) {
    state.organization = organization;
  },
};

const actions = {
  dispatchRefreshOrganization({ commit }) {
    commit("updateOrganization", { organization: [] });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
