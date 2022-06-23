<template>
  <div>
    <div v-if="hang" class="HangStyle">
      <!-- TODO: 关于确认弹窗的逻辑需要重新修正 -->
      <span style="color: #0066cc">当前流程正常运行，如需将流程挂起，请进行认证操作</span>
      <div class="confirm" @click="confirmation()">挂起确认</div>
    </div>
    <div v-else class="HangStyle">
      <span style="color: #0066cc">当前流程已被挂起，如需将继续执行流程，请进行认证操作</span>
      <div class="confirm" @click="confirmation()">重新激活</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RuntimeImplementHang',
  props: {
    workflow: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    hang() {
      return this.workflow.Hange
    },
  },
  methods: {
    confirmation() {
      this.$refs.runtimeConfirmation.dialogVisible = true
    },
  },
}
</script>

<style></style>
