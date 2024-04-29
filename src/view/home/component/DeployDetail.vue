<template>
  <div>
    <el-dialog
      title="部署详情"
      fullscreen
      :visible="visible"
      @close="onCancel"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <!-- <workflow-info
        :workflow="workflow"
        :xml="workflow.processFile"
        :processDisplayInfo="processDisplayInfo"
      /> -->

      <model-detail
        v-if="visible"
        :modelInfo="workflow.modelInfo"
        :modelTasks="workflow.modelTasks"
        :xml="xml"
        :processDisplayInfo="processDisplayInfo"
      ></model-detail>
      <span slot="footer">
        <el-button class="remove-button" @click="onDeleteClick">
          删除
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ModelDetail from './ModelDetail.vue';
import { fetchModelInfo, deleteModel } from '../../../api/workflowModel';

export default {
  name: 'DeployDetail',
  components: {
    ModelDetail,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    modelId: {
      type: String,
      default: '',
      required: true,
    },
    processName: {
      type: String,
      default: '',
    },
    xml: {
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
    processDisplayInfo() {
      return [
        {
          label: '流程名称',
          value: this.processName,
        },
        {
          label: '模型名称',
          value: this.workflow?.modelInfo?.modelName,
        },
        // {
        //   label: '部署时间',
        //   value: this.workflow.createTime,
        // },
        {
          label: '应用项目',
          value: this.workflow?.modelInfo?.projectName,
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
        this.fetchModelInfo();
      }
    },
    // modelId: {
    //   immediate: true,
    //   handler(modelId) {
    //     if (!modelId) {
    //       return;
    //     }
    //     this.fetchModelInfo();
    //   },
    // },
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
        const { code, msg } = await deleteModel({
          modelId: this.modelId,
        });
        if (code !== '200') {
          this.$message.error(msg);
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
      this.workflow = {};
      this.$emit('update:visible', false);
    },
    async fetchModelInfo() {
      const { data, code, msg } = await fetchModelInfo({
        modelId: this.modelId,
      });
      if (code !== '200') {
        this.$message.error(msg);
        return;
      }
      this.workflow = data;
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
