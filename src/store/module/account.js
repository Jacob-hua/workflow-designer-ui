const state = {
  tenantId: "18",
  userInfo: {},
};

const getters = {};

const mutations = {
  updateTenantId(state, { tenantId }) {
    state.tenantId = tenantId;
  },
  updateUserInfo(state, { userInfo }) {
    state.userInfo = userInfo;
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
