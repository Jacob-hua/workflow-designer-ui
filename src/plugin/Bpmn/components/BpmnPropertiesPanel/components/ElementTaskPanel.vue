<template>
  <div>
    <el-form label-position="right" label-width="100px">
      <el-form-item label="处理用户">
        <el-tag v-if="assignee.value" closable @close="onDelAssignee" :key="assignee.value">{{
          assignee.label
        }}</el-tag>
        <el-button v-if="!assignee.value" class="button-new-tag" size="small" @click="onAddAssignee"
          >添加处理用户</el-button
        >
        <element-user-task-drawer
          v-bind="$attrs"
          :visible.sync="assigneeVisible"
          model="singleUser"
          @submit="onAssigneeSubmit"
        />
      </el-form-item>
      <el-form-item label="候选用户">
        <el-tag v-for="{ value, label } in candidateUsers" :key="value" closable @close="onDelCandidateUser(value)">
          {{ label }}
        </el-tag>
        <el-button class="button-new-tag" size="small" @click="onEditCandidate">编辑候选用户</el-button>
        <element-user-task-drawer
          v-bind="$attrs"
          :visible.sync="candidateVisible"
          model="multipleUser"
          @submit="onCandidateSubmit"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ElementUserTaskDrawer from './ElementUserTaskDrawer.vue'
export default {
  name: 'ElementTaskPanel',
  components: { ElementUserTaskDrawer },
  data() {
    return {
      assigneeVisible: false,
      candidateVisible: false,
      assignee: {},
      candidateUsers: [],
    }
  },
  methods: {
    onAddAssignee() {
      this.assigneeVisible = true
    },
    onDelAssignee() {
      this.assignee = {}
    },
    onAssigneeSubmit(result) {
      this.assignee = result[0]
    },
    onEditCandidate() {
      this.candidateVisible = true
    },
    onCandidateSubmit(result) {
      this.candidateUsers = result
    },
    onDelCandidateUser(tag) {
      this.candidateUsers.splice(
        this.candidateUsers.findIndex(({ value }) => value === tag),
        1
      )
    },
  },
}
</script>

<style></style>
