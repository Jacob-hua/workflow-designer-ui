<template>
  <div>
    <el-form label-position="right" label-width="100px">
      <el-form-item label="处理用户">
        <el-tag v-if="assignee.value" closable @close="onDelAssignee" :key="assignee.value">{{
          assignee.label
        }}</el-tag>
        <el-button v-if="!assignee.value" class="button-new-tag" size="small" @click="onAddUser">添加用户</el-button>
        <element-user-task-drawer
          v-bind="$attrs"
          :visible.sync="taskDrawerVisible"
          model="singleUser"
          @submit="onAssigneeSubmit"
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
      taskDrawerVisible: false,
      assignee: {},
    }
  },
  methods: {
    onAddUser() {
      this.taskDrawerVisible = true
    },
    onDelAssignee() {
      this.assignee = {}
    },
    onAssigneeSubmit(result) {
      this.assignee = result[0]
    },
  },
}
</script>

<style></style>
