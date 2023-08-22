<template>
  <el-dialog
    title="驳回确认"
    :close-on-click-modal="false"
    :visible="visible"
    width="70%"
    top="5vh"
    @close="onCancel"
    append-to-body
  >
    <bpmn-info :xml="workflow.processDeployResource" @selectedShape="onSelectedChanged" :showProcess="true"/>
    <div class="reason-wrapper">
      <el-form ref="rejectForm" :model="rejectForm" :rules="rejectRules">
        <el-form-item label="驳回原因" prop="rejectReason">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="rejectForm.rejectReason" />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button class="submit-button" @click="onSubmit">确 定</el-button>
      <el-button class="cancel-button" @click="onCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import BpmnInfo from '../../../component/BpmnInfo.vue'
import { putRejectTask } from '@/api/unit/api.js'
import { mapState } from 'vuex'

export default {
  name: 'RuntimeRejectConfirmation',
  components: {
    BpmnInfo,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    workflow: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      rejectForm: {
        rejectReason: '',
      },
      taskKey: '',
      rejectRules: {
        rejectReason: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }],
      },
    }
  },
  computed: {
    ...mapState('account', ['userInfo']),
  },
  methods: {
    onCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    onSubmit() {
      let _this = this;
      this.$refs.rejectForm['validate'] &&
        this.$refs.rejectForm.validate(async (valid) => {
          if (!valid) {
            return
          }
          if (!_this.taskKey) {
            _this.$message.error('请选择被驳回的节点')
            return
          }
          const { errorInfo } = await putRejectTask({
            message: _this.rejectForm.rejectReason,
            processInstanceId: _this.workflow.processInstanceId,
            taskKey: _this.taskKey,
            userId: _this.userInfo.account,
            currentTaskId: _this.workflow.newTaskId,
            processKey: _this.workflow.processDeployKey,
            currentTaskName: _this.workflow.processDeployName,
            currentTaskKey: _this.workflow.taskKey,
            createBy: _this.userInfo.account,
          })
          if (errorInfo.errorCode) {
            _this.$message.error(errorInfo.errorMsg)
            return
          }
          _this.$message.success('驳回成功！')
          _this.$emit('rejected')
          _this.$emit('update:visible', false)
        })
    },
    onSelectedChanged(selectedShape) {
      if (!selectedShape) {
        return
      }
      this.taskKey = selectedShape.id
    },
  },
}
</script>

<style scoped lang="scss">
.reason-wrapper {
  height: 150px;
  margin-top: 12px;
}

.submit-button {
  @include primaryBtn;
}

.cancel-button {
  @include cancelBtn;
}
</style>
