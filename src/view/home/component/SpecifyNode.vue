<template>
  <el-dialog
    title="执行人员选择"
    :visible.sync="nodeDialogVisible"
    @close="close"
    append-to-body
  >
    <div class="process-canvas">
      <bpmn-viewer
        :visible="true"
        :xml="xml"
        :prop="{
          bpmnRenderer: {
            defaultFillColor: 'none',
            defaultStrokeColor: '#666666',
            defaultLabelColor: '#666666',
          },
        }"
        @loaded="onBpmnViewerLoaded"
      />
    </div>
    <div class="specify-box">
      <el-card class="box-card">
        <div slot="header" class="clear-dix">
          <span>{{ operationTitle }}</span>
        </div>
        <div class="specify-select">
          <p>当前节点</p>
          <div class="node-name">{{ taskInfo.taskName }}</div>
          <p>选择指定节点</p>
          <el-select v-model="selectedNode" filterable="">
            <el-option
              v-for="item in taskNodeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </el-card>
    </div>
    <div slot="footer">
      <div class="next" @click="save()" type="primary">保存</div>
      <div class="cancel" @click="close">取消</div>
    </div>
  </el-dialog>
</template>
<script>
import { fetchTaskNodeList } from '../../../api/workflow';
export default {
  name: 'SpecifyNode',
  props: {
    nodeDialogVisible: {
      type: Boolean,
      default: false,
    },
    xml: {
      type: String,
      default: '',
      required: true,
    },
    taskInfo: {
      type: Object,
    },
    flag: {
      type: String,
    },
    processId: {
      type: String,
    },
    historySelected: {
      type: Object,
    },
  },
  data() {
    return {
      iBpmnViewer: null,
      taskNodeList: [],
      selectedNode: '',
    };
  },
  computed: {
    operationTitle() {
      return this.flag === 'dynamic_set' ? '其他节点指定：' : '同一节点指定：';
    },
  },
  watch: {
    async nodeDialogVisible(value) {
      if (value) {
        await this.fetchTaskNodeList();
        this.selectedNode = this.historySelected
          ? this.historySelected.value
          : '';
      }
    },
  },
  methods: {
    onBpmnViewerLoaded(iBpmnViewer) {
      this.iBpmnViewer = iBpmnViewer;
      this.$emit('loaded', iBpmnViewer);
    },
    async fetchTaskNodeList() {
      const { data, code, msg } = await fetchTaskNodeList({
        processId: this.processId,
        taskDefKey: this.taskInfo.taskDefKey,
      });
      if (code !== '200') {
        this.$message.error(msg);
        return;
      }
      this.taskNodeList = data.map(({ taskDefKey, taskName }) => {
        return {
          label: taskName,
          value: taskDefKey,
        };
      });
    },
    save() {
      // if(!this.selectedNode){
      //   this.close();
      //   return;
      // }
      const selectedData = this.taskNodeList.filter(
        ({ value }) => this.selectedNode === value
      );
      this.$emit('saveNode', { selectedData, flag: this.flag });
      this.close();
    },
    close() {
      this.selectedNode = '';
      this.$emit('closeNodeDialog');
    },
  },
};
</script>
<style lang="scss" scoped>
.next {
  @include primaryBtn;
}
.cancel {
  @include cancelBtn;
}
.process-canvas {
  height: 300px;
  border: 1px solid $border-color;
}
p {
  color: #fff;
}
.node-name {
  width: 100px;
  border: 1px solid #409eff;
  text-align: center;
  display: inline-block;
  line-height: 30px;
  border-radius: 4px;
  color: #409eff;
  margin-bottom: 10px;
}
</style>
