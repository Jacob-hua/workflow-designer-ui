<template>
  <div>
    <div class="container">
      <div v-if="hang">
        <div>当前流程已被挂起，如需将继续操作流程，请进行认证操作</div>
        <el-button @click="onConfirmation('激活确认')">重新激活</el-button>
      </div>
      <div v-else>
        <div>当前流程正常运行，如需将流程挂起，请进行认证操作</div>
        <el-button @click="onConfirmation('挂起确认')">挂起</el-button>
      </div>
    </div>
    <runtime-confirmation
      :title="confirmationTitle"
      :visible.sync="confirmationVisible"
      @validate="onConfirmationValidate"
    />
  </div>
</template>

<script>
import RuntimeConfirmation from "./RuntimeConfirmation.vue";
import { putHangInstance, getActiveInstance } from "@/api/unit/api.js";
import { mapState } from "vuex";

export default {
  name: "RuntimeImplementHang",
  components: {
    RuntimeConfirmation,
  },
  props: {
    workflow: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      confirmationVisible: false,
      confirmationTitle: "",
    };
  },
  computed: {
    ...mapState("account", ["userInfo"]),
    hang() {
      return this.workflow.curTrack.status.split(",").includes("hang");
    },
  },
  methods: {
    onConfirmation(title) {
      this.confirmationVisible = true;
      this.confirmationTitle = title;
    },
    onConfirmationValidate(validate) {
      if (!validate) {
        return;
      }
      if (this.hang) {
        getActiveInstance({
          processInstanceId: this.workflow.processInstanceId,
          taskId: this.workflow.newTaskId,
          assignee: this.userInfo.account,
        }).then((res) => {
          this.$message.success("激活成功");
          this.$emit("hang");
        });
      } else {
        putHangInstance({
          processInstanceId: this.workflow.processInstanceId,
          taskId: this.workflow.newTaskId,
          assignee: this.userInfo.account,
        }).then((res) => {
          this.$message.success("挂起成功");
          this.$emit("hang");
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../index.scss";

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
