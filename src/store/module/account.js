import customRenderer from "@/plugin/package/module/custom-renderer";

const state = {
  tenantId: "18",
  userInfo: {},
  currentOrganization: "",
};

const getters = {};

const mutations = {
  updateTenantId(state, { tenantId }) {
    state.tenantId = tenantId;
  },
  updateUserInfo(state, { userInfo }) {
    state.userInfo = userInfo;
    state.tenantId = userInfo.tenants?.[0]?.id;
  },
  updateCurrentOrganization(state, { currentOrganization }) {
    console.log('updateCurrentOrganization', currentOrganization)
    state.currentOrganization = currentOrganization;
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
