<template>
  <el-dialog title="终止" :close-on-click-modal="false" :visible="visible" width="70%" @close="onCancel" append-to-body>
    <div>
      <div class="rejectWord">终止原因（必填）</div>
      <div>
        <el-input type="textarea" :rows="15" placeholder="请输入内容" v-model="terminateReason"> </el-input>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">确 定</el-button>
      <el-button @click="onCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'RuntimeTerminateConfirmation',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      terminateReason: '',
    }
  },
  methods: {
    onCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    onSubmit() {
      this.$emit('submit', { terminateReason: this.terminateReason })
      this.$emit('update:visible', false)
    },
  },
}
</script>

<style>
</style>
