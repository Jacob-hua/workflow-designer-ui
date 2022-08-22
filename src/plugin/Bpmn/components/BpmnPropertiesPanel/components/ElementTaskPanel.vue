<template>
  <div>
    <el-form label-position="right" label-width="100px">
      <el-form-item label="处理用户">
        <el-tag v-if="assignee.value" closable @close="onDelAssignee" :key="assignee.value">{{
          assignee.label
        }}</el-tag>
        <el-button
          v-if="!assignee.value"
          class="button-new-tag"
          size="small"
          @click="onAddAssignee"
          icon="el-icon-edit"
        >
          处理用户
        </el-button>
        <element-user-task-drawer
          v-bind="$attrs"
          v-if="assigneeVisible"
          :visible.sync="assigneeVisible"
          model="singleUser"
          :selected="selectedAssignee"
          @submit="onAssigneeSubmit"
        />
      </el-form-item>
      <el-form-item label="候选用户">
        <el-tag v-for="{ value, label } in candidateUsers" :key="value" closable @close="onDelCandidateUser(value)">
          {{ label }}
        </el-tag>
        <el-button class="button-new-tag" size="small" @click="onEditCandidateUser" icon="el-icon-edit">
          候选用户
        </el-button>
        <element-user-task-drawer
          v-bind="$attrs"
          v-if="candidateUserVisible"
          :visible.sync="candidateUserVisible"
          :selected="candidateUsers"
          model="multipleUser"
          @submit="onCandidateUserSubmit"
        />
      </el-form-item>
      <el-form-item label="候选分组">
        <el-tag v-for="{ value, label } in candidateGroups" :key="value" closable @close="onDelCandidateGroup(value)">
          {{ label }}
        </el-tag>
        <el-button class="button-new-tag" size="small" @click="onEditCandidateGroup" icon="el-icon-edit">
          候选分组
        </el-button>
        <element-user-task-drawer
          v-bind="$attrs"
          v-if="candidateGroupVisible"
          :visible.sync="candidateGroupVisible"
          :selected="candidateGroups"
          model="multipleOrganization"
          @submit="onCandidateGroupSubmit"
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
      candidateUserVisible: false,
      candidateGroupVisible: false,
      assignee: {},
      candidateUsers: [],
      candidateGroups: [],
    }
  },
  computed: {
    selectedAssignee() {
      if (Object.prototype.hasOwnProperty.call(this.assignee, 'value')) {
        return [this.assignee]
      }
      return []
    },
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
    onEditCandidateUser() {
      this.candidateUserVisible = true
    },
    onCandidateUserSubmit(result) {
      this.candidateUsers = result
    },
    onDelCandidateUser(tag) {
      this.candidateUsers.splice(
        this.candidateUsers.findIndex(({ value }) => value === tag),
        1
      )
    },
    onEditCandidateGroup() {
      this.candidateGroupVisible = true
    },
    onCandidateGroupSubmit(result) {
      this.candidateGroups = result
    },
    onDelCandidateGroup(tag) {
      this.candidateGroups.splice(
        this.candidateGroups.findIndex(({ value }) => value === tag),
        1
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
