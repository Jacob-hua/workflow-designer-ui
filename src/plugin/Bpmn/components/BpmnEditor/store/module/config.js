const state = () => ({
  generateIdFunc: () => {},
})

const getters = {}

const mutations = {
  updateGenerateIdFunc(state, { newFunc = () => {} }) {
    state.generateIdFunc = newFunc
  },
}

const actions = {
  async dispatchGenerateId({ state: { generateIdFunc } }, payload) {
    const res = await Promise.resolve(generateIdFunc(payload))
    return res ?? new Date().getTime().toString()
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
