<template>
  <div style="margin-top: 15px">
    <div class="peopleList-title">加签:</div>
    <div class="peopleList">
      <div class="peopleList-item" v-for="({ userId }, index) in signature" :key="index">
        {{ userId }}
      </div>
    </div>
    <span class="editButton" @click="onEditSignature()">编辑</span>
    <runtime-people ref="runtimePeople" @submit="onRuntimePeopleSubmit" />
  </div>
</template>

<script>
import runtimePeople from './runtimePeople.vue'
import { postModifyProcessUser } from '@/api/unit/api.js'

export default {
  components: { runtimePeople },
  name: 'RuntimeImplementSignature',
  props: {
    workflow: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    signature() {
      if (!Array.isArray(this.workflow.trackList)) {
        return []
      }
      const assignees = this.workflow.trackList.at(-1).assignee.split(',') ?? []
      // TODO: userId 改为 account 更合适
      return assignees.reduce((signature, assignee) => [...signature, { userId: assignee }], [])
    },
  },
  methods: {
    onEditSignature() {
      this.$refs.runtimePeople.multipleSelection = JSON.parse(JSON.stringify(this.signature))
      this.$refs.runtimePeople.detailSelection = JSON.parse(JSON.stringify(this.signature))
      this.$refs.runtimePeople.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.runtimePeople.toggleRowSelection()
      })
    },
    async onRuntimePeopleSubmit() {
      let dataListsignature = []
      this.$refs.runtimePeople.multipleSelection.forEach((item) => {
        dataListsignature.push(item.userId)
      })
      await postModifyProcessUser({
        processInstanceId: this.workflow.processInstanceId,
        taskKey: this.workflow.taskKey,
        userList: dataListsignature,
      })
      this.$message.success('加减签成功')
      this.$emit('completed')
      this.$refs.runtimePeople.dialogVisible = false
    },
  },
}
</script>

<style></style>
