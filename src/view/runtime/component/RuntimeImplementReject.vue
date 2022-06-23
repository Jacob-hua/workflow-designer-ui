<template>
  <div>
    <div v-if="reject.rejectBollen" class="HangStyle">
      <span style="color: #0066cc">当前流程正常运行，如需将流程驳回，请进行认证操作</span>
      <div class="confirm" @click="confirmation()">驳回验证</div>
    </div>
    <div v-else>
      <!-- TODO: 此处应该是驳回信息的反馈显示 -->
      <div class="rejectData">
        <span>{{ reject.data }}</span>
      </div>
      <div class="rejectName">
        <span>{{ reject.name }}</span>
      </div>
      <div>
        <span class="rejectWord">驳回至</span>
        <span class="rejectResult">{{ reject.rejectResult }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RuntimeImplementReject',
  props: {
    workflow: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    reject() {
      return this.workflow.reject ?? {}
    },
  },
}
</script>

<style></style>
