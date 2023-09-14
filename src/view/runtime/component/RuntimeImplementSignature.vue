<template>
  <div>
    <div class="container">
      <div class="content">
        <div>会签:</div>
        <div class="info">
          <div>
            <div class="user" v-for="({ username, account }, index) in signature" :key="index">
              <long-text content-style="color: #fff" :content="username" :title="account"/>
            </div>
          </div>
        </div>
        <el-button @click="onEditSignature()" :disabled="editDiasble">编辑</el-button>
      </div>
    </div>
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
import LongText from '@/component/LongText';
export default {
  components: { RuntimePeople, LongText },
  name: 'RuntimeImplementSignature',
  props: {
    workflow: {
      type: Object,
      default: () => ({}),
    },
    operationDisable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      runtimePeopleVisible: false,
      runtimePeopleSelected: [],
    }
  },
  computed: {
    signature() {
      // const assignees = this.workflow.curTrack?.assignee.split(',') ?? []
      // return assignees.reduce((signature, assignee) => [...signature, { userId: assignee }], [])
      return this.workflow.curTrack?.assigneeInfoDTOList ?? [];
    },
    editDiasble() {
      return this.operationDisable
    }
  },
  methods: {
    onEditSignature() {
      this.runtimePeopleSelected = this.signature.map(({account, username}) => ({
        userId: account,
        lastName:username
      }));
      // this.runtimePeopleSelected = this.signature
      this.runtimePeopleVisible = true
    },
    async onRuntimePeopleSubmit({ selections }) {
      const userList = selections.map(({ userId }) => userId)
      await postModifyProcessUser({
        processInstanceId: this.workflow.processInstanceId,
        taskKey: this.workflow.taskKey,
        taskId: this.workflow.newTaskId,
        userList,
      })
      this.$message.success('加减签成功')
      this.$emit('completed')
    },
  },
}
</script>

<style scoped lang="scss">
@import '../index.scss';

@include container;

@include userContent;
</style>
