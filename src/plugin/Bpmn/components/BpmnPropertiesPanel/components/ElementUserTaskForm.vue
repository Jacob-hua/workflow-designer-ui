<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="处理用户">
        <el-row>
          <el-col :span="18">
            <el-input v-if="customAssignee" />
            <el-cascader v-else
                         :options="userGroupOptions">
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
            <el-input v-if="customCandidate" />
            <el-cascader v-else
                         :options="userGroupOptions">
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
            <el-input v-if="customCandidateGroup" />
            <el-cascader v-else
                         :options="userGroupOptions">
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
import { mapState } from 'vuex'

export default {
  name: 'ElementUserTaskForm',
  props: {},
  data() {
    return {
      customAssignee: false,
      customCandidate: false,
      customCandidateGroup: false,
    }
  },
  computed: {
    ...mapState('bpmn/config', ['userGroupOptions', 'userOptions']),
  },
}
</script>

<style>
</style>