<template>
  <el-dialog title="驳回" :visible="visible" width="70%" @close="onCancel" append-to-body>
    <bpmn-editor
      :key="workflow.processInstanceId"
      :pelatteVisible="false"
      :headerVisible="false"
      :linterToggle="false"
      :xml="workflow.processDeployResource"
      :selectedChanged="onSelectedChanged"
    />
    <div>
      <div class="rejectWord">驳回原因（必填）</div>
      <div>
        <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="rejectReason"> </el-input>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'RuntimeRejectConfirmation',
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
      rejectReason: '',
      taskKey: '',
    }
  },
  methods: {
    onCancel() {
      this.$emit('cancel')
    },
    onSubmit() {
      this.$emit('sumit', {
        rejectReason: this.rejectReason,
        taskKey: this.taskKey,
      })
    },
    onSelectedChanged(shape) {
      console.log(shape)
    },
  },
}
</script>

<style></style>
