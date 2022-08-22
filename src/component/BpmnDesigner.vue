<template>
  <div class="bpmn-wrapper">
    <bpmn-editor
      :id="projectData.code"
      :name="projectData.name"
      :xml="projectData.content"
      :generateIdFunc="fetchUUID"
      :prop="{
        bpmnRenderer: {
          defaultFillColor: 'none',
          defaultStrokeColor: '#666666',
          defaultLabelColor: '#666666',
        },
      }"
      @loaded="onEditorLoaded"
    />
    <bpmn-properties-panel
      ref="propertiesPanel"
      :iBpmnModeler="iBpmnModeler"
      :userGroup="userGroup"
      :lazyLoadUser="fetchUser"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getSystemGroupTree, postPersonUser } from '../api/unit/api'
import { getGlobalUUID } from '../api/globalConfig'
import IBpmnModeler from '../plugin/Bpmn/IBpmnModeler'

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
    label: `${data.lastName}`,
  }
}

export default {
  name: 'bpmnDesigner',
  props: {
    projectData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      iBpmnModeler: new IBpmnModeler(),
      userGroup: [],
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'currentOrganization']),
  },
  mounted() {
    this.fetchUserGroup({
      projectCode: this.currentOrganization,
      displayType: 'tree',
    }).then((res) => {
      this.userGroup = res
    })
  },
  methods: {
    onEditorLoaded(iBpmnModeler) {
      this.iBpmnModeler = iBpmnModeler
      this.$emit('loaded', iBpmnModeler)
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
    async fetchUUID() {
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
