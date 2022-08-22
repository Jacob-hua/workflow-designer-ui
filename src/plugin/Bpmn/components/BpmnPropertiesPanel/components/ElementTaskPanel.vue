<template>
  <div>
    <el-form label-position="right" label-width="100px">
      <el-form-item label="处理用户">
        <el-tag v-if="displayAssignee.value" closable @close="onDelAssignee" :key="displayAssignee.value">{{
          displayAssignee.label
        }}</el-tag>
        <el-button
          v-if="!displayAssignee.value"
          class="button-new-tag"
          size="small"
          @click="onAddAssignee"
          icon="el-icon-edit"
        >
          处理用户
        </el-button>
        <element-user-task-drawer
          v-if="assigneeVisible"
          model="singleUser"
          :visible.sync="assigneeVisible"
          :namespace="namespace"
          :lazyLoadUser="lazyLoadUser"
          :selected="selectedAssignee"
          @submit="onAssigneeSubmit"
        />
      </el-form-item>
      <el-form-item label="候选用户">
        <el-tag
          v-for="{ value, label } in displayCandidateUsers"
          :key="value"
          closable
          @close="onDelCandidateUser(value)"
        >
          {{ label }}
        </el-tag>
        <el-button class="button-new-tag" size="small" @click="onEditCandidateUser" icon="el-icon-edit">
          候选用户
        </el-button>
        <element-user-task-drawer
          v-if="candidateUserVisible"
          model="multipleUser"
          :visible.sync="candidateUserVisible"
          :namespace="namespace"
          :lazyLoadUser="lazyLoadUser"
          :selected="displayCandidateUsers"
          @submit="onCandidateUserSubmit"
        />
      </el-form-item>
      <el-form-item label="候选分组">
        <el-tag
          v-for="{ value, label } in displayCandidateGroups"
          :key="value"
          closable
          @close="onDelCandidateGroup(value)"
        >
          {{ label }}
        </el-tag>
        <el-button class="button-new-tag" size="small" @click="onEditCandidateGroup" icon="el-icon-edit">
          候选分组
        </el-button>
        <element-user-task-drawer
          v-if="candidateGroupVisible"
          model="multipleOrganization"
          :visible.sync="candidateGroupVisible"
          :namespace="namespace"
          :lazyLoadUser="lazyLoadUser"
          :selected="displayCandidateGroups"
          @submit="onCandidateGroupSubmit"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ElementUserTaskDrawer from './ElementUserTaskDrawer.vue'
import { deepCopy, deepEquals, emptyPropertiesObject } from '../../../utils/object'

export default {
  name: 'ElementTaskPanel',
  components: { ElementUserTaskDrawer },
  props: {
    namespace: {
      type: String,
      required: true,
      default: '',
    },
    lazyLoadUser: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      assigneeVisible: false,
      candidateUserVisible: false,
      candidateGroupVisible: false,
      displayAssignee: {},
      displayCandidateUsers: [],
      displayCandidateGroups: [],
    }
  },
  computed: {
    selectedAssignee() {
      if (Object.prototype.hasOwnProperty.call(this.displayAssignee, 'value')) {
        return [this.displayAssignee]
      }
      return []
    },
    userTask() {
      return this.$store.state[this.namespace].panel.userTask
    },
  },
  watch: {
    userTask: {
      deep: true,
      immediate: true,
      handler({ displayAssignee, displayCandidateUsers, displayCandidateGroups }) {
        this.displayAssignee = { ...displayAssignee }
        this.displayCandidateUsers = [...displayCandidateUsers]
        this.displayCandidateGroups = [...displayCandidateGroups]
      },
    },
    displayAssignee: {
      deep: true,
      immediate: true,
      handler(displayAssignee) {
        if (emptyPropertiesObject(displayAssignee) || deepEquals(displayAssignee, this.userTask.displayAssignee)) {
          return
        }
        this.updateUserTask({ displayAssignee: deepCopy(displayAssignee) })
      },
    },
    displayCandidateUsers: {
      deep: true,
      immediate: true,
      handler(displayCandidateUsers) {
        if (deepEquals(displayCandidateUsers, this.userTask.displayCandidateUsers)) {
          return
        }
        this.updateUserTask({ displayCandidateUsers: deepCopy(displayCandidateUsers) })
      },
    },
    displayCandidateGroups: {
      deep: true,
      immediate: true,
      handler(displayCandidateGroups) {
        if (deepEquals(displayCandidateGroups, this.userTask.displayCandidateGroups)) {
          return
        }
        this.updateUserTask({ displayCandidateGroups: deepCopy(displayCandidateGroups) })
      },
    },
  },
  methods: {
    updateUserTask(payload) {
      this.$store.commit({
        type: `${this.namespace}/panel/updateUserTask`,
        newUserTask: {
          ...this.userTask,
          ...payload,
        },
      })
    },
    onAddAssignee() {
      this.assigneeVisible = true
    },
    onDelAssignee() {
      this.displayAssignee = {}
    },
    onAssigneeSubmit(result) {
      this.displayAssignee = result?.[0] ?? {}
    },
    onEditCandidateUser() {
      this.candidateUserVisible = true
    },
    onCandidateUserSubmit(result) {
      this.displayCandidateUsers = result
    },
    onDelCandidateUser(tag) {
      this.displayCandidateUsers.splice(
        this.displayCandidateUsers.findIndex(({ value }) => value === tag),
        1
      )
    },
    onEditCandidateGroup() {
      this.candidateGroupVisible = true
    },
    onCandidateGroupSubmit(result) {
      this.displayCandidateGroups = result
    },
    onDelCandidateGroup(tag) {
      this.displayCandidateGroups.splice(
        this.displayCandidateGroups.findIndex(({ value }) => value === tag),
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
