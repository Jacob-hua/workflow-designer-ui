<template>
  <div>
    <el-dialog title="部署详情" fullscreen :visible="visible" @close="onCancel">
      <workflow-info
        :workflow="workflow"
        :xml="workflow.processResource"
        :processDisplayInfo="processDisplayInfo"
      />
      <span slot="footer">
        <el-button
          class="remove-button"
          @click="onDeleteClick"
        >
          删除
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDeleteDeployment,
  getDeployAndProcessInfo,
} from '@/api/unit/api.js';
import { mapState } from 'vuex';
import WorkflowInfo from './WorkflowInfo.vue';

export default {
  name: 'DeployDetail',
  components: {
    WorkflowInfo,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    deployedId: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {
      workflow: {},
    };
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
    processDisplayInfo() {
      return [
        {
          label: '流程编码',
          value: this.workflow.processCode,
        },
        {
          label: '模型名称',
          value: this.workflow.deployName,
        },
        // {
        //   label: '部署时间',
        //   value: this.workflow.createTime,
        // },
        {
          label: '应用项目',
          value: this.workflow.projectName,
        },
        // {
        //   label: '部署人',
        //   value: this.workflow.createName,
        // },
      ];
    },
  },
  watch: {
    visible(value) {
      if (value) {
        this.fetchDeployedWorkflow();
      }
    },
    deployedId: {
      immediate: true,
      handler(deployedId) {
        if (!deployedId) {
          return;
        }
        // this.fetchDeployedWorkflow();
      },
    },
  },
  methods: {
    onCancel() {
      this.$emit('cancel');
      this.colse();
    },
    async onDeleteClick() {
      try {
        await this.$confirm('删除后不可恢复, 请确认是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'warning',
        });
        const { errorInfo, result } = await getDeleteDeployment({
          id: this.workflow.deployRecordId,
          cascade: false,
        });
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg);
          return;
        }
        this.$message({
          type: 'success',
          message: '删除成功!',
        });
        this.$emit('deleted');
        this.colse();
      } catch (error) {}
    },
    colse() {
      this.$emit('update:visible', false);
    },
    async fetchDeployedWorkflow() {
      try {
        const { errorInfo, result } = await getDeployAndProcessInfo(
          this.deployedId
        );
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg);
          return;
        }
        this.workflow = result;
      } catch (error) {
        this.workflow = {};
      }
    },
  },
};
</script>

<style scoped lang="scss">
.remove-button {
  @include cancelBtn;
}
</style>

<style lang="scss">
.btn-custom-cancel {
  @include cancelbutton;
}
</style>
