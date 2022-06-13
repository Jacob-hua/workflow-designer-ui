import { Message } from "element-ui";
import { getProjectList } from "../../api/globalConfig";

const state = {
  organization: [],
};

const getters = {
  rootOrganizations: (state) => {
    return state.organization;
  },
  rootOrganizationChildren: (state) => (value) => {
    return state.organization.find(({ value: v }) => v === value)?.children ?? [];
  },
};

const mutations = {
  updateOrganization(state, { organization }) {
    state.organization = organization;
  },
};

const actions = {
  async dispatchRefreshOrganization({ commit, rootState }) {
    const { errorInfo, result } = await getProjectList({
      count: -1,
      projectCode: "",
      tenantId: rootState.account.tenantId,
      type: "",
    });
    if (errorInfo.errorCode) {
      Message.error(errorInfo.errorMessage);
      return;
    }
    commit("updateOrganization", { organization: organization2CascaderData(result ?? []) });

    function organization2CascaderData(data) {
      if (Array.isArray(data)) {
        return data.map(organization2CascaderData);
      }
      const result = {
        id: data.id,
        value: data.code,
        label: data.name,
      };
      if (Array.isArray(data.children) && data.children.length > 0) {
        result["children"] = data.children.map(organization2CascaderData);
      }
      return result;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
