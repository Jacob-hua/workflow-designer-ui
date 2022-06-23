<template>
  <div>
    <div v-if="termination.terminationBollon" class="HangStyle">
      <span style="color: #0066cc">当前流程正常运行，如需将流程终止，请进行认证操作</span>
      <div class="confirm" @click="confirmation()">终止确认</div>
    </div>
    <div v-else>
      <!-- TODO: 显示终止信息的反馈 -->
      <div class="rejectData">
        <span>{{ termination.data }}</span>
      </div>
      <div class="rejectName">
        <span>{{ termination.name }}</span>
      </div>
      <div class="rejectWord">流程终止</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RuntimeImplementTermination',
  props: {
    workflow: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    termination() {
      return this.workflow.termination ?? {}
    },
  },
  methods: {
    confirmation() {},
  },
}
</script>

<style></style>
