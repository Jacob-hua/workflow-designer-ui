<template>
  <div style="margin-top: 15px">
    <div class="peopleList-title">加签:</div>
    <div class="peopleList">
      <div class="peopleList-item" v-for="({ userId }, index) in signature" :key="index">
        {{ userId }}
      </div>
    </div>
    <span class="editButton" @click="onEditSignature()">编辑</span>
    <runtime-people
      title="用户选择"
      :visible.sync="runtimePeopleVisible"
      :selected="runtimePeopleSelected"
      @submit="onRuntimePeopleSubmit"
    />
  </div>
</template>

<script>
import RuntimePeople from './RuntimePeople.vue'
import { postModifyProcessUser } from '@/api/unit/api.js'

export default {
  components: { RuntimePeople },
  name: 'RuntimeImplementSignature',
  props: {
    workflow: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      runtimePeopleVisible: false,
      runtimePeopleSelected: [],
    }
  },
  computed: {
    signature() {
      const assignees = this.workflow.curTrack?.assignee.split(',') ?? []
      return assignees.reduce((signature, assignee) => [...signature, { userId: assignee }], [])
    },
  },
  methods: {
    onEditSignature() {
      this.runtimePeopleSelected = this.signature
      this.runtimePeopleVisible = true
    },
    async onRuntimePeopleSubmit({ selections }) {
      const userList = selections.map(({ userId }) => userId)
      await postModifyProcessUser({
        processInstanceId: this.workflow.processInstanceId,
        taskKey: this.workflow.taskKey,
        userList,
      })
      this.$message.success('加减签成功')
      this.$emit('completed')
    },
  },
}
</script>

<style scoped>
.peopleList {
  margin-top: 15px;
}

.peopleList-item {
  display: inline-block;
  width: 96px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border: 1px solid #108cee;
  border-radius: 5px;
  margin-left: 20px;
}

.editButton {
  position: absolute;
  right: 20px;
  top: 10px;
  color: #4d478e;
  cursor: pointer;
}
</style>
