import { Message } from 'element-ui'
import { getProjectList, getOrganizations } from '../../api/globalConfig'
import { router } from '../../main'

const state = {
  organization: [],
  organizations: []
}

const getters = {
  rootOrganizations(state) {
    return state.organization
  },
  rootOrganizationChildren(state) {
    return (value) => {
      return state.organization.find(({ value: v }) => v === value)?.children ?? []
    }
  },
  rootOrganizationChildrenAndAll(state) {
    return (value) => {
      const children = state.organization.find(({ value: v }) => v === value)?.children ?? []
      return [{ value: '', label: '全部系统' }, ...children]
    }
  },
  findRootOrganizationByIndex(state) {
    return (index) => {
      return state.organization[index] ?? {}
    }
  },
  findOrganizations(state) {
    return (paths) => {
      return findTargetNode(state.organization, paths) ?? []

      function findTargetNode(organization, paths) {
        for (let i = 0; i < organization.length; i++) {
          const { value, children } = organization[i]
          if (value === paths) {
            return children ?? []
          }
          if (Array.isArray(children)) {
            const result = findTargetNode(children, paths)
            if (result !== undefined) {
              return result
            }
          }
        }
      }
    }
  },
  projectOrganizations(state) {
    return () => {
      return state.organizations
    }
  }
}

const mutations = {
  updateOrganization(state, { organization }) {
    state.organization = organization
  },
  updateOrganizations(state, {organizations}) {
    state.organizations = organizations;
  }
}

const actions = {
  async dispatchRefreshOrganization({ commit, rootState }) {
    const { errorInfo, result } = await getProjectList({
      count: -1,
      projectCode: '',
      tenantId: rootState.account.tenantId,
      type: '',
      menuRoute: router.currentRoute.name,
      account: JSON.parse(sessionStorage.getItem('loginData')).account,
    })
    if (errorInfo.errorCode) {
      Message.error(errorInfo.errorMessage)
      return
    }
    commit('updateOrganization', { organization: organization2CascaderData(result ?? []) })
    commit(
      'account/updateCurrentOrganization',
      { currentOrganization: organization2CascaderData(result ?? [])[0]?.value },
      { root: true }
    )

    function organization2CascaderData(data) {
      if (Array.isArray(data)) {
        return data.map(organization2CascaderData)
      }
      const result = {
        id: data.id,
        value: data.code,
        label: data.name,
      }
      if (Array.isArray(data.children) && data.children.length > 0) {
        result['children'] = data.children.map(organization2CascaderData)
      }
      return result
    }
  },
  async dispatchProjectOriganizations({commit}){
    const {data, code, msg} = await getOrganizations();
    if(code!=='200'){
      Message.error(msg)
    }

    commit('updateOrganizations', { organizations: organizationCascaderData(data ?? []) })

    function organizationCascaderData(data) {
      if (Array.isArray(data)) {
        return data.map(organizationCascaderData)
      }
      const result = {
        id: data.id,
        value: data.id,
        label: data.name,
      }
      if (Array.isArray(data.children) && data.children.length > 0) {
        result['children'] = data.children.map(organizationCascaderData)
      }
      return result
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
