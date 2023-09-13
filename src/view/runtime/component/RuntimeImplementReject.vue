<template>
  <div>
    <div class="container">
      <div>
        <div>当前流程正常运行，如需将流程驳回，请进行认证操作</div>
        <el-button @click="onConfirmation" :disabled="operationDisable">驳回</el-button>
      </div>
    </div>
    <runtime-confirmation title="驳回确认" :visible.sync="confirmationVisible" @validate="onConfirmationValidate" />
    <runtime-reject-confirmation
      v-if="rejectConfirmationVisible"
      :visible.sync="rejectConfirmationVisible"
      :workflow="workflow"
      @rejected="onRejected"
    />
  </div>
</template>

<script>
import RuntimeConfirmation from './RuntimeConfirmation.vue'
import RuntimeRejectConfirmation from './RuntimeRejectConfirmation.vue'

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
    operationDisable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rejectConfirmationVisible: false,
      confirmationVisible: false,
    }
  },
  methods: {
    onConfirmation() {
      this.confirmationVisible = true
    },
    onConfirmationValidate() {
      this.rejectConfirmationVisible = true
    },
    onRejected() {
      this.$emit('rejected')
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
