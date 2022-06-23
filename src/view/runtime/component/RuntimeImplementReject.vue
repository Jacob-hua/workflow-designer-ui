<template>
  <div class="HangStyle">
    <span style="color: #0066cc">当前流程正常运行，如需将流程驳回，请进行认证操作</span>
    <div class="confirm" @click="onConfirmation">驳回验证</div>
    <runtime-confirmation ref="runtimeConfirmation" @validate="onConfirmationValidate" />
    <runtime-reject-confirmation
      :visible="rejectConfirmationVisible"
      :workflow="workflow"
      @cancel="onRejectConfirmationCancel"
      @submit="onRejectConfirmationSubmit"
    />
  </div>
</template>

<script>
import runtimeConfirmation from './runtimeConfirmation.vue'
import RuntimeRejectConfirmation from './RuntimeRejectConfirmation.vue'

export default {
  name: 'RuntimeImplementReject',
  components: {
    runtimeConfirmation,
    RuntimeRejectConfirmation,
  },
  props: {
    workflow: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      rejectConfirmationVisible: false,
    }
  },
  methods: {
    onConfirmation() {
      this.rejectConfirmationVisible = true
      // this.$refs.runtimeConfirmation.dialogVisible = true
    },
    onConfirmationValidate() {
      this.$refs.runtimeConfirmation.dialogVisible = false
      this.rejectConfirmationVisible = true
    },
    onRejectConfirmationCancel() {
      this.rejectConfirmationVisible = false
    },
    onRejectConfirmationSubmit() {
      this.rejectConfirmationVisible = false
    },
  },
}
</script>

<style scoped>
.HangStyle {
  text-align: center;
  margin-top: 50px;
}

.confirm {
  cursor: pointer;
  color: rgb(255, 76, 0);
  margin-top: 20px;
}
</style>
