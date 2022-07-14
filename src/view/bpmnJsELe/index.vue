<template>
  <div class="bpmn-wrapper">
    <bpmn-editor :id="projectData.code" :name="projectData.name" :xml="projectData.content" @loaded="onEditorLoaded" />
    <bpmn-properties-panel
      ref="propertiesPanel"
      :iBpmnModeler="iBpmnModeler"
      :fetchUserGroup="fetchUserGroup"
      :fetchUser="fetchUser"
      :fetchId="fetUUID"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getSystemGroupTree, postPersonUser } from '../../api/unit/api'
import { getGlobalUUID } from '../../api/globalConfig'
import IBpmnModeler from '../../plugin/Bpmn/IBpmnModeler'

function groupTree2CascaderData(data) {
  if (Array.isArray(data)) {
    return data.map(groupTree2CascaderData)
  }
  const result = {
    value: data.groupId,
    label: data.groupName,
  }
  if (Array.isArray(data.children) && data.children.length > 0) {
    result['children'] = data.children.map(groupTree2CascaderData)
  }
  return result
}

function users2CascaderData(data) {
  if (Array.isArray(data)) {
    return data.map(users2CascaderData)
  }
  return {
    value: data.userId,
    label: `${data.firstName}${data.lastName}`,
  }
}

export default {
  name: 'bpmnEle',
  props: {
    projectData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      iBpmnModeler: new IBpmnModeler(),
    }
  },
  computed: {
    ...mapState(['tenantId']),
  },
  mounted() {
    // 触发请求用户组，也就是会在action中调用this.fetchUserGroup，
    // 并将数据同步到state
    this.$refs.propertiesPanel.dispatchRequestUserGroup({
      projectCode: 'XM_aff0659724a54c119ac857d4e560b47b',
      displayType: 'tree',
    })
  },
  methods: {
    onEditorLoaded(iBpmnModeler) {
      this.iBpmnModeler = iBpmnModeler
    },
    async fetchUserGroup(params) {
      try {
        const { errorInfo, result } = await getSystemGroupTree(params)
        if (errorInfo.errorCode) {
          return []
        }
        return groupTree2CascaderData(result) ?? []
      } catch (error) {
        return []
      }
    },
    async fetchUser({ value }) {
      try {
        const { errorInfo, result } = await postPersonUser({
          groupId: value,
          limit: 999999,
          name: '',
          page: 1,
          tenantId: this.tenantId,
          userId: 'admin',
        })
        if (errorInfo.errorCode) {
          return []
        }
        return users2CascaderData(result?.dataList ?? [])
      } catch (error) {
        return []
      }
    },
    async fetUUID() {
      try {
        const { errorInfo, result } = await getGlobalUUID()
        if (errorInfo.errorCode) {
          return
        }
        return result
      } catch (error) {
        return
      }
    },
  },
}
</script>

<style scoped lang="scss">
.bpmn-wrapper {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
}
</style>
