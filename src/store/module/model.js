const state = {
  modelTaskConfigs: [],
  startFormVersionId:''
}

const getters = {}

const mutations = {
  updateModelTaskConfigs(state, {modelTaskConfigs}){
    state.modelTaskConfigs = modelTaskConfigs
  },
  updateStartFormVersionId(state, {startFormVersionId}){
    state.startFormVersionId = startFormVersionId
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
