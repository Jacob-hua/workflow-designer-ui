import { executeApi, getThirdInterfaceList } from '@/api/globalConfig'
import ApiEnum from '@/enum/ApiTypeEnum'

const state = {
  interFaceOption: [],
  dynamicOption: [],
  thirdPartyApi: [],
  temporary: new Set(),
}

const getters = {
  findInterfaceById(state) {
    return (id) => state.interFaceOption.find(({ id: dataId }) => dataId === id) ?? {}
  },
}

const mutations = {
  updateInterFaceOption(state, { interFaceOption }) {
    state.interFaceOption = interFaceOption
  },
  updateDynamicOption(state, { dynamicOption }) {
    state.dynamicOption = dynamicOption
  },
  addThirdPartyApi(state, { id }) {
    state.temporary.add(id)
    state.thirdPartyApi = [...state.temporary]
  },
  refreshState(state) {
    state = {
      interFaceOption: [],
      dynamicOption: [],
      thirdPartyApi: [],
      temporary: new Set(),
    }
  },
}

const process_variation = (variation = '', relationMap = new Map()) => {
  let parameters = ''
  if (!variation.includes(`$\{`)) {
    return variation
  }
  for (const key of relationMap.keys()) {
    parameters
      ? (parameters = parameters.replaceAll(`\$\{${key}\}`, relationMap.get(key)))
      : (parameters = variation.replaceAll(`\$\{${key}\}`, relationMap.get(key)))
  }
  return parameters
}

const postTransformationParams = ({ body }, relationMap) => {
  return process_variation(body, relationMap)
}

const getTransformationParams = ({ parameter }, relationMap) => {
  return process_variation(parameter, relationMap)
}

const actions = {
  async refreshApiList({ commit, rootState }) {
    const { result } = await getThirdInterfaceList({
      tenantId: rootState.account.tenantId,
      ascription: rootState.account.currentOrganization,
    })
    commit('updateInterFaceOption', { interFaceOption: result ?? [] })
  },

  executeFunction({ commit }, { api, relationMap }) {
    const parameterMap = {
      [ApiEnum.API_TYPE_POST]: postTransformationParams,
      [ApiEnum.API_TYPE_GET]: getTransformationParams,
    }
    executeApi({
      apiMark: api?.apiMark,
      sourceMark: api?.sourceMark,
      data: parameterMap[api?.method]?.(api, relationMap),
    }).then(({ result: options }) => {
      commit('updateDynamicOption', { dynamicOption: options ?? [] })
    })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
