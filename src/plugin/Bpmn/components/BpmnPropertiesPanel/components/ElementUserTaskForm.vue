<template>
  <div>
    <el-form label-position="right" label-width="80px" :model="userTaskForm">
      <el-form-item label="处理用户">
        <el-row>
          <el-col :span="18">
            <el-input v-if="userTaskForm.customAssignee" v-model="userTaskForm.assignee" />
            <el-cascader
              v-else
              v-model="userTaskForm.assignee"
              :options="userGroupOptions"
              :props="userCascaderProps"
              :show-all-levels="false"
              clearable
            >
            </el-cascader>
          </el-col>
          <el-col :span="6">
            <el-checkbox v-model="userTaskForm.customAssignee">自定义</el-checkbox>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="候选用户">
        <el-row>
          <el-col :span="18">
            <el-input v-if="userTaskForm.customCandidate" v-model="userTaskForm.candidateUsers" />
            <el-cascader
              v-else
              v-model="userTaskForm.candidateUsers"
              :options="userGroupOptions"
              :props="candidateUsersCascaderProps"
              :show-all-levels="false"
              clearable
            >
            </el-cascader>
          </el-col>
          <el-col :span="6">
            <el-checkbox v-model="userTaskForm.customCandidate">自定义</el-checkbox>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="候选分组">
        <el-row>
          <el-col :span="18">
            <el-input v-if="userTaskForm.customCandidateGroup" v-model="userTaskForm.candidateGroups" />
            <el-cascader
              v-else
              v-model="userTaskForm.candidateGroups"
              :options="userGroupOptions"
              :show-all-levels="false"
              :props="candidateCascaderProps"
              clearable
            >
            </el-cascader>
          </el-col>
          <el-col :span="6">
            <el-checkbox v-model="userTaskForm.customCandidateGroup">自定义</el-checkbox>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { deepCopy, deepEquals, emptyPropertiesObject } from '../../../utils/object'

export default {
  name: 'ElementUserTaskForm',
  data() {
    return {
      userTaskForm: {},
      userCascaderProps: {
        emitPath: false,
        lazy: true,
        lazyLoad: (node, resolve) => {
          this.cascaderLazyLoad(node, resolve)
        },
      },
      candidateUsersCascaderProps: {
        emitPath: false,
        multiple: true,
        lazy: true,
        lazyLoad: (node, resolve) => {
          this.cascaderLazyLoad(node, resolve)
        },
      },
      candidateCascaderProps: {
        emitPath: false,
        multiple: true,
      },
    }
  },
  computed: {
    ...mapState('bpmn/config', ['userGroupOptions', 'userOptions']),
    ...mapState('bpmn/panel', ['userTask']),
    ...mapGetters('bpmn/config', ['findUserGroupChildren']),
  },
  watch: {
    userTask(value) {
      this.userTaskForm = { ...value }
    },
    userTaskForm: {
      deep: true,
      immediate: true,
      handler(value) {
        if (emptyPropertiesObject(value) || deepEquals(value, this.userTask)) {
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
    ...mapActions('bpmn/config', ['dispatchRequestUser', 'userGroupLabel']),
    cascaderLazyLoad(node, resolve) {
      // 如果原来的结构中有子节点，则直接返回
      if (this.findUserGroupChildren(node)) {
        resolve()
        return
      }
      this.dispatchRequestUser(node.value).then(resolve)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../index.scss';

.el-checkbox {
  padding-left: 6px;
}
</style>
