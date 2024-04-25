<template>
  <el-dialog
    title="执行人员选择"
    :visible.sync="gatewayDialogVisible"
    @close="close"
    append-to-body
    :close-on-click-modal="false"
  >
    <div class="process-canvas">
      <bpmn-viewer
        :visible="gatewayDialogVisible"
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
          <span>条件选择</span>
        </div>
        <div class="specify-select">
          <p>当前节点</p>
          <div class="node-name">{{ taskInfo.taskName }}</div>
          <p>选择指定节点</p>
          <el-select v-model="selectedNode" filterable clearable>
            <el-option
              v-for="item in taskNodeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p>选择表单字段</p>
          <el-select v-model="selectedFormitem" filterable clearable>
            <el-option
              v-for="item in formitemList"
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
import { mapState } from 'vuex';
import { fetchTaskNodeList } from '../../../api/workflow';
import { fetchFormVersion } from '../../../api/workflowForm';
export default {
  name: 'SpecifyGateway',
  props: {
    gatewayDialogVisible: {
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
    processId: {
      type: String,
    },
    historyInfo: {
      type: Object,
    },
  },
  data() {
    return {
      iBpmnViewer: null,
      taskNodeList: [],
      selectedNode: '',
      formitemList: [],
      selectedFormitem: '',
    };
  },
  computed: {
    ...mapState('model', ['modelTaskConfigs', 'startFormVersionId']),
  },
  watch: {
    async gatewayDialogVisible(value) {
      if (value) {
        await this.fetchTaskNodeList();
        this.selectedNode = this.historyInfo.value;
      }
    },
    async selectedNode(newVal, oldVal) {
      if (!newVal) {
        this.selectedFormitem = '';
        return;
      }
      if (newVal === oldVal) return;
      await this.fetchFormFile(newVal);
      this.selectedFormitem = this.historyInfo.pos;
    },
  },
  methods: {
    onBpmnViewerLoaded(iBpmnViewer) {
      this.iBpmnViewer = iBpmnViewer;
      iBpmnViewer.elementRegistryForEach(item => {
        if(item.id === this.taskInfo.taskDefKey){
          iBpmnViewer.canvasAddMarker(item, 'svgOncomplete')
        }else {
          if(iBpmnViewer.canvasHasMarker(item, 'svgOncomplete')){
            iBpmnViewer.canvasRemoveMarker(item, 'svgOncomplete')
          }
        }
      })
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
    async fetchFormFile(taskKey) {
      this.formitemList = [];
      this.selectedFormitem = '';
      let formVersionId = '';
      if (taskKey === 'start_task') {
        if (!this.startFormVersionId) {
          this.$message.warning('未关联启动项表单');
          return;
        }
        formVersionId = this.startFormVersionId;
      } else {
        if (!this.modelTaskConfigs) return;
        const modelTaskInfo = this.modelTaskConfigs.find(
          ({ taskDefKey }) => taskDefKey === taskKey
        );
        if (!modelTaskInfo || !modelTaskInfo.taskFormVersionId) {
          this.$message.warning('选择节点未绑定表单');
          return;
        }
        formVersionId = modelTaskInfo.taskFormVersionId;
      }
      const { data, code, msg } = await fetchFormVersion({
        formVersionId,
      });
      if (code !== '200') {
        this.$message.error(msg);
      }
      const formVersionFile = JSON.parse(data.formVersionFile);
      const schema = formVersionFile.schema;
      this.handleFormSchma(schema);
    },

    handleFormSchma(schema) {
      const properties = schema.properties;
      this.formitemList = flatFormSchema(properties);

      function flatFormSchema(item) {
        let res = [];
        for (let obj in item) {
          if (!item[obj].properties) {
            res.push({
              label: item[obj].title,
              value: item[obj]['x-designable-id'],
            });
          } else {
            res = res.concat(flatFormSchema(item[obj]));
          }
        }
        return res;
      }
    },
    save() {
      if (!this.selectedNode || !this.selectedFormitem) {
        this.$message.warning('节点或者表单不能为空');
        // this.close();
        return;
      }
      const selectedData = this.taskNodeList.find(
        ({ value }) => this.selectedNode === value
      );
      const selectForm = this.formitemList.find(
        ({ value }) => value === this.selectedFormitem
      );
      this.$emit('saveGateway', { selectedData, selectForm });
      this.close();
    },
    close() {
      this.selectedNode = '';
      this.selectedFormitem = '';
      this.$emit('closeGatewayDialog');
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
