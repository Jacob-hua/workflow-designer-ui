<template>
  <el-dialog title="驳回" :visible="visible" width="70%" @close="onCancel" append-to-body>
     <processData
        ref="processData"
        v-if="visible"
        @selection="onSelectedChanged"
        :BpmnContant="workflow.processDeployResource"
        :taskKey="workflow.taskKey"
        :processInstanceId="workflow.processInstanceId"
      ></processData>
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
import processData from './processData.vue'

export default {
  name: 'RuntimeRejectConfirmation',
  components: {
    processData
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
      rejectReason: '',
      taskKey: '',
    }
  },
  methods: {
    onCancel() {
      this.$emit('cancel')
    },
    onSubmit() {
      this.$emit('submit', {
        rejectReason: this.rejectReason,
        taskKey: this.taskKey,
      })
    },
    onSelectedChanged(taskKey) {
      this.taskKey = taskKey
    },
  },
}
</script>

<style scoped>
.rejectWord {
  margin: 20px 0px;
}
</style>
