<template>
  <div class="bpmnEle">
    <bpmn-editor :id="projectData.code"
                 :name="projectData.name"
                 :xml="projectData.content" />
    <bpmn-properties-panel />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { getSystemGroupTree, postPersonUser } from '../../api/unit/api'
import { getGlobalUUID } from '../../api/globalConfig'

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
  computed: {
    ...mapState(['tenantId'])
  },
  mounted() {
    // 定义请求用户组的方法
    this.updateRequestUserGroupFunc({ newFunc: this.fetchUserGroup })
    // 定义请求用户的方法
    this.updateRequestUserFunc({ newFunc: this.fetchUser })
    // 定义ID生成器方法
    this.updateGenerateIdFunc({ newFunc: this.fetUUID })
    // 触发请求用户组，也就是会在action中调用this.fetchUserGroup，
    // 并将数据同步到state
    this.dispatchRequestUserGroup({
      projectCode: 'XM_aff0659724a54c119ac857d4e560b47b',
      displayType: 'tree',
    })
  },
  methods: {
    ...mapActions('bpmn/config', ['dispatchRequestUserGroup']),
    ...mapMutations('bpmn/config', [
      'updateRequestUserGroupFunc',
      'updateRequestUserFunc',
      'updateGenerateIdFunc',
    ]),
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
    async fetchUser(groupId) {
      try {
        const { errorInfo, result } = await postPersonUser({
          groupId,
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
    }
  },
}
</script>

<style scoped>
.bpmnEle {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
}
</style>
