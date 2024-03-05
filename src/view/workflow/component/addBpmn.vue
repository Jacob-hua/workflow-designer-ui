<template>
  <el-dialog :title="title" :visible="visible" @close="onClose" fullscreen>
    <div class="editor-wrapper">
      <bpmn-designer
        v-if="visible"
        :projectData="projectData"
        @loaded="onBpmnDesignerLoaded"
        @getRootInfo="getRootBaseInfo"
      />
    </div>
    <div slot="footer">
      <!-- <el-button class="publish" @click="onPublish">发布</el-button> -->
      <el-button class="save" @click="onSave">保存</el-button>
      <el-button class="cancel" @click="onClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  updateWorkFlow,
  createWorkFlow,
  publishWorkflow,
} from '@/api/managerWorkflow';
import { saveWorkflow, updateWorkflow } from '../../../api/workflow';
import BpmnDesigner from '@/component/BpmnDesigner.vue';
import { mapState } from 'vuex';

export default {
  components: {
    BpmnDesigner,
  },
  props: {
    projectData: {
      type: Object,
      default: () => ({}),
    },
    visible: {
      type: Boolean,
      default: false,
    },
    publick: {
      type: String,
      default: '',
    },
    bindType: {
      type: String,
      default: 'bind',
    },
  },
  data() {
    return {
      iBpmnModeler: {},
      rootBaseInfo: {},
    };
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId', 'currentOrganization']),
    title() {
      return this.projectData.processId ? '编辑流程' : '新建流程';
    },
  },
  methods: {
    onBpmnDesignerLoaded(iBpmnModeler) {
      this.iBpmnModeler = iBpmnModeler;
    },
    getRootBaseInfo(rootBaseInfo) {
      this.rootBaseInfo = rootBaseInfo;
    },
    processFormData() {
      // TODO: 此处的文件名和文件id应该以addProject.vue中设置的参数为主
      const { processName, processDesc } = this.rootBaseInfo;
      let processFormData = new FormData();
      if (this.projectData.id) {
        processFormData.set('processId', this.projectData.id);
      }
      processFormData.set('processName', processName);
      // processFormData.set('docName', processName + '.bpmn')
      if (this.publick) {
        processFormData.set('ascription', 'public');
      } else {
        processFormData.set('ascription', '');
        processFormData.set('business', this.projectData.business);
      }
      processFormData.set('processDesc', processDesc);
      processFormData.set('bindType', this.projectData.bindType);
      return processFormData;
    },
    onClose() {
      this.$emit('close');
      this.$emit('update:visible', false);
    },
    async onSave() {
      const { error } = await this.iBpmnModeler.validate();
      if (error.length > 0) {
        this.$message.error('流程设计存在错误/警告');
        return;
      }
      try {
        const { xml } = await this.iBpmnModeler.saveXML({
          format: true,
        });
        const processFormData = this.processFormData();
        processFormData.set(
          'processId',
          new File([xml], processFormData.processName + '.bpmn', {
            type: 'bpmn20-xml',
          })
        );
        processFormData.set('status', 'drafted');
        let promise;
        // 如果projectData存在id，则走修改的流程
        if (this.projectData.id) {
          promise = updateWorkFlow(processFormData);
        } else {
          promise = saveWorkflow(processFormData);
        }
        const { code, msg } = await Promise.resolve(promise);
        if (code!=='200') {
          this.$message.error(msg);
          return;
        }
        this.$message.success('保存成功');
        this.$emit('submit', 'drafted');
        this.onClose();
      } catch (error) {}
    },
  },
};
</script>

<style scoped lang="scss">
.editor-wrapper {
  height: 100%;
}

.publish {
  @include primaryBtn;
}

.save {
  @include primaryBtn;
}

.cancel {
  @include cancelBtn;
}
</style>
