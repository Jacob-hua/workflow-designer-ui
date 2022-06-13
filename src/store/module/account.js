const state = {
  tenantId: "18",
  userInfo: {
    name: "admin",
    id: "1",
  },
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

const actions = {
  dispatchRefreshTenantId({ commit }) {
    commit("updateTenantId", { tenantId: "18" });
  },
  dispatchRefreshUserInfo({ commit }) {
    commit("updateUserInfo", { userInfo: { name: "admin", id: "1" } });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
