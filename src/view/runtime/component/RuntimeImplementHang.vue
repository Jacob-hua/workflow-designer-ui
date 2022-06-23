<template>
  <div>
    <div v-if="hang" class="HangStyle">
      <span style="color: #0066cc">当前流程已被挂起，如需将继续执行流程，请进行认证操作</span>
      <div class="confirm" @click="onConfirmation">重新激活</div>
    </div>
    <div v-else class="HangStyle">
      <span style="color: #0066cc">当前流程正常运行，如需将流程挂起，请进行认证操作</span>
      <div class="confirm" @click="onConfirmation">挂起确认</div>
    </div>
    <runtime-confirmation ref="runtimeConfirmation" @validate="onConfirmationValidate" />
  </div>
</template>

<script>
import runtimeConfirmation from './runtimeConfirmation.vue'
import { putHangInstance, getActiveInstance } from '@/api/unit/api.js'

export default {
  name: 'RuntimeImplementHang',
  components: {
    runtimeConfirmation,
  },
  props: {
    workflow: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    hang() {
      return this.workflow.curTrack.status.split(',').includes('hang')
    },
  },
  methods: {
    onConfirmation() {
      this.$refs.runtimeConfirmation.dialogVisible = true
    },
    onConfirmationValidate(validate) {
      if (!validate) {
        return
      }
      if (this.hang) {
        getActiveInstance({
          processInstanceId: this.workflow.processInstanceId,
        }).then((res) => {
          this.$message.success('激活成功')
          this.$emit('completed')
        })
      } else {
        putHangInstance({
          processInstanceId: this.workflow.processInstanceId,
        }).then((res) => {
          this.$message.success('挂起成功')
          this.$emit('completed')
        })
      }
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
