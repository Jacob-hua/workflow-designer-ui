<template>
  <el-dialog :title="title" :visible="visible" @close="onClose" fullscreen :close-on-press-escape="false">
    <div class="editor-wrapper">
      <bpmn-designer
        v-if="visible"
        :projectData="projectData"
        :isEditor="isEditor"
        @loaded="onBpmnDesignerLoaded"
        @getRootInfo="getRootBaseInfo"
      />
    </div>
    <div slot="footer">
      <!-- <el-button class="publish" @click="onPublish">发布</el-button> -->
      <el-button class="save" @click="onSave">保存</el-button>
      <el-button class="cancel" @click="onClose">取消</el-button>
    </div>
    <editor-confirm
      :editorConfirmVisible="editorConfirmVisible"
      @submit="handleConfirm"
      @close="closeConfirm"
    ></editor-confirm>
  </el-dialog>
</template>
<script>
import { saveWorkflow, updateWorkflow } from '../../../api/workflow';
import BpmnDesigner from '@/component/BpmnDesigner.vue';
import editorConfirm from './editorConfirm.vue';
import { mapState } from 'vuex';
import md5 from 'md5';

export default {
  components: {
    BpmnDesigner,
    editorConfirm,
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
    isQuote: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      iBpmnModeler: {},
      rootBaseInfo: {},
      editorConfirmVisible: false,
    };
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId', 'currentOrganization']),
    title() {
      return this.projectData.processId ? '编辑流程' : '新建流程';
    },
    isEditor() {
      return this.projectData.processId ? true : false;
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
      if (this.projectData.processId) {
        processFormData.set('processId', this.projectData.processId);
      }
      if (this.bindType === 'bind') {
        processFormData.set('tenantId', this.projectData.tenantId ?? '');
        processFormData.set('projectId', this.projectData.projectId ?? '');
        processFormData.set('applicationId', this.projectData.applicationId) ??
          '';
      }
      processFormData.set('bindType', this.bindType);
      processFormData.set('processName', processName);
      processFormData.set('processDesc', processDesc);
      return processFormData;
    },
    onClose() {
      this.$emit('close');
      this.$emit('update:visible', false);
    },
    async onSave() {
      if (this.projectData.processId) {
        const { xml } = await this.iBpmnModeler.saveXML();
        if (md5(this.projectData.processFile) === md5(xml)) {
          this.createOrUpdateWorkflow();
        } else {
          this.editorConfirmVisible = true;
        }
      } else {
        this.createOrUpdateWorkflow();
      }
    },
    closeConfirm() {
      this.editorConfirmVisible = false;
    },
    handleConfirm(value) {
      this.rootBaseInfo = {
        ...this.rootBaseInfo,
        ...value,
      };
      this.createOrUpdateWorkflow();
    },
    async createOrUpdateWorkflow() {
      const { error } = await this.iBpmnModeler.validate();
      if (error.length > 0) {
        this.$message.error('流程设计存在错误/警告');
        return;
      }
      try {
        const { xml } = await this.iBpmnModeler.saveXML();
        const processFormData = this.processFormData();
        processFormData.set(
          'processFile',
          new File([xml], processFormData.processName + '.bpmn', {
            type: 'bpmn20-xml',
          })
        );
        let promise;
        if (this.isQuote) {
          promise = saveWorkflow(processFormData);
        } else {
          if (this.projectData.processId) {
            if (md5(this.projectData.processFile) === md5(xml)) {
              const { processName, processDesc } = this.rootBaseInfo;
              promise = updateWorkflow({
                processId: this.projectData.processId,
                processName: processName,
                processDesc: processDesc,
              });
            } else {
              promise = saveWorkflow(processFormData);
            }
          } else {
            promise = saveWorkflow(processFormData);
          }
        }
        const { code, msg } = await Promise.resolve(promise);
        if (code !== '200') {
          this.$message.error(msg);
          return;
        }
        this.closeConfirm();
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
