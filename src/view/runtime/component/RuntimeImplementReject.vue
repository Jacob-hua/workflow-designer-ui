<template>
  <div>
    <div class="container">
      <div>
        <div>当前流程正常运行，如需将流程驳回，请进行认证操作</div>
        <el-button @click="onConfirmation">驳回</el-button>
      </div>
    </div>
    <runtime-confirmation title="驳回确认" :visible.sync="confirmationVisible" @validate="onConfirmationValidate" />
    <runtime-reject-confirmation
      :visible.sync="rejectConfirmationVisible"
      :workflow="workflow"
      @submit="onRejectConfirmationSubmit"
    />
  </div>
</template>

<script>
import RuntimeConfirmation from './RuntimeConfirmation.vue'
import RuntimeRejectConfirmation from './RuntimeRejectConfirmation.vue'
import { putRejectTask } from '@/api/unit/api.js'
import { mapState } from 'vuex'

export default {
  name: 'RuntimeImplementReject',
  components: {
    RuntimeConfirmation,
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
      confirmationVisible: false,
    }
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId']),
  },
  methods: {
    onConfirmation() {
      this.confirmationVisible = true
    },
    onConfirmationValidate() {
      this.rejectConfirmationVisible = true
    },
    onRejectConfirmationSubmit(rejectData) {
      if (!rejectData.taskKey) {
        this.$message.error('请选择被驳回的节点')
        return
      }

      putRejectTask({
        message: rejectData.rejectReason,
        processInstanceId: this.workflow.processInstanceId,
        taskKey: rejectData.taskKey,
        userId: this.userInfo.account,
        currentTaskId: this.workflow.newTaskId,
        processKey: this.workflow.processDeployKey,
        currentTaskName: this.workflow.processDeployName,
        currentTaskKey: this.workflow.taskKey,
        createBy: this.userInfo.account,
      }).then((res) => {
        this.rejectConfirmationVisible = false
        this.$message.success('驳回成功！')
        this.$emit('rejectSuccess')
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
