const state = {
  thirdLogin: false,
  tenantId: '18',
  userInfo: {},
  currentOrganization: '',
}

const getters = {}

const mutations = {
  updateThirdLogin(state, { thirdLogin }) {
    state.thirdLogin = thirdLogin
  },
  updateTenantId(state, { tenantId }) {
    state.tenantId = tenantId
  },
  updateUserInfo(state, { userInfo }) {
    state.userInfo = userInfo
    state.tenantId = userInfo.tenants?.[0]?.id
  },
  updateCurrentOrganization(state, { currentOrganization }) {
    state.currentOrganization = currentOrganization
  },
}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
