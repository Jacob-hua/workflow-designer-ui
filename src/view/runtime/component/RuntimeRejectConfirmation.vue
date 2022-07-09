<template>
  <el-dialog title="驳回确认" :visible="visible" width="70%" top="5vh" @close="onCancel" append-to-body>
    <processData
      ref="processData"
      v-if="visible"
      @selection="onSelectedChanged"
      :BpmnContant="workflow.processDeployResource"
      :taskKey="workflow.taskKey"
      :processInstanceId="workflow.processInstanceId"
    ></processData>
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
import processData from './processData.vue'

export default {
  name: 'RuntimeRejectConfirmation',
  components: {
    processData,
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
  methods: {
    onCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    onSubmit() {
      this.$refs.rejectForm['validate'] &&
        this.$refs.rejectForm.validate((valid) => {
          if (!valid) {
            return
          }
          this.$emit('submit', {
            rejectReason: this.rejectForm.rejectReason,
            taskKey: this.taskKey,
          })
          this.$emit('update:visible', false)
        })
    },
    onSelectedChanged(taskKey) {
      this.taskKey = taskKey
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
