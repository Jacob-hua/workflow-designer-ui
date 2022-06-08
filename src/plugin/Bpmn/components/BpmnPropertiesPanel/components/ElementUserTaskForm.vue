<template>
  <div>
    <el-form label-position="right"
             label-width="80px"
             :model="userTaskForm">
      <el-form-item label="处理用户">
        <el-row>
          <el-col :span="18">
            <el-input v-if="customAssignee"
                      v-model="userTaskForm.assignee" />
            <el-cascader v-else
                         :options="userGroupOptions"
                         v-model="userTaskForm.assignee"
                         clearable>
            </el-cascader>
          </el-col>
          <el-col :span="6">
            <el-checkbox v-model="customAssignee">自定义</el-checkbox>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="候选用户">
        <el-row>
          <el-col :span="18">
            <el-input v-if="customCandidate"
                      v-model="userTaskForm.candidateUsers" />
            <el-cascader v-else
                         :options="userGroupOptions"
                         v-model="userTaskForm.candidateUsers"
                         clearable>
            </el-cascader>
          </el-col>
          <el-col :span="6">
            <el-checkbox v-model="customCandidate">自定义</el-checkbox>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="候选分组">
        <el-row>
          <el-col :span="18">
            <el-input v-if="customCandidateGroup"
                      v-model="userTaskForm.candidateGroups" />
            <el-cascader v-else
                         :options="userGroupOptions"
                         v-model="userTaskForm.candidateGroups"
                         clearable>
            </el-cascader>
          </el-col>
          <el-col :span="6">
            <el-checkbox v-model="customCandidateGroup">自定义</el-checkbox>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { deepCopy, deepEquals } from '../../../utils/object'

export default {
  name: 'ElementUserTaskForm',
  props: {},
  data() {
    return {
      customAssignee: false,
      customCandidate: false,
      customCandidateGroup: false,
      userTaskForm: {},
    }
  },
  computed: {
    ...mapState('bpmn/config', ['userGroupOptions', 'userOptions']),
    ...mapState('bpmn/panel', ['userTask']),
  },
  watch: {
    userTask(value) {
      this.userTaskForm = { ...value }
    },
    userTaskForm: {
      deep: true,
      immediate: true,
      handler(value) {
        if (deepEquals(value, this.userTask)) {
          return
        }
        this.updateUserTask({ newUserTask: deepCopy(value) })
      },
    },
  },
  mounted() {
    this.userTaskForm = deepCopy(this.userTask)
  },
  methods: {
    ...mapMutations('bpmn/panel', ['updateUserTask']),
  },
}
</script>

<style>
</style>