<template>
  <div>
    <div class="container">
      <div>
        <div>当前流程正常运行，如需将流程终止，请进行认证操作</div>
        <el-button @click="onConfirmation" :disabled="editDiasble">终止</el-button>
      </div>
    </div>
    <runtime-confirmation :visible.sync="confirmationVisible" @validate="onConfirmationValidate" />
    <runtime-terminate-confirmation
      :visible.sync="terminateConfirmationVisible"
      @submit="onTerminateConfirmationSubmit"
    />
  </div>
</template>

<script>
import RuntimeConfirmation from './RuntimeConfirmation.vue'
import RuntimeTerminateConfirmation from './RuntimeTerminateConfirmation.vue'
import { putCancelInstance } from '@/api/unit/api.js'
import { mapState } from "vuex";

export default {
  name: 'RuntimeImplementTermination',
  components: { RuntimeTerminateConfirmation, RuntimeConfirmation },
  props: {
    workflow: {
      type: Object,
      default: () => ({}),
    },
    operationDisable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      terminateConfirmationVisible: false,
      confirmationVisible: false,
    }
  },
  computed: {
    ...mapState("account", ["tenantId", "userInfo"]),
    editDiasble() {
      return this.operationDisable
    }
  },
  methods: {
    onConfirmation() {
      this.confirmationVisible = true
    },
    onConfirmationValidate() {
      this.terminateConfirmationVisible = true
    },
    onTerminateConfirmationSubmit({ terminateReason }) {
      putCancelInstance({
        cancelReason: terminateReason,
        processInstanceId: this.workflow.processInstanceId,
        taskId: this.workflow.newTaskId,
        assignee: this.userInfo.account
      }).then((res) => {
        this.$message.success('终止成功')
        this.$emit('terminated')
      })
    },
  },
}
</script>

<style scoped lang="scss">
@import '../index.scss';

@include container;

.container > div {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  button {
    margin-top: 20px;
    @include dangerPlainBtn;
  }
}
</style>
