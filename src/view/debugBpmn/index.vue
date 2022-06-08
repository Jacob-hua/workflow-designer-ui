<template>
  <div class="wrapper">
    <bpmn-editor />
    <bpmn-properties-panel />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { getSystemGroupTree, postPersonUser } from '../../api/unit/api'

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
    label: `${data.firstName}.${data.lastName}`,
  }
}

export default {
  name: 'debugBpmn',
  mounted() {
    // 设置请求用户组的方法
    this.updateRequestUserGroupFunc({ newFunc: this.fetchUserGroup })
    // 设置请求用户的方法
    this.updateRequestUserFunc({ newFunc: this.fetchUser })
    // 触发请求用户组
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
          tenantId: '18',
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
  },
}
</script>

<style>
.wrapper {
  width: 100%;
  height: 90%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
}
</style>