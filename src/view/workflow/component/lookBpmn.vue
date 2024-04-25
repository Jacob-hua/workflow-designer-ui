<template>
  <el-dialog title="查看" :visible="visible" fullscreen @close="close" :close-on-click-modal="false">
    <div>
      <bpmn-info
        :xml="projectData.processFile"
        :processDisplayInfo="processDisplayInfo"
        :showProcess="true"
      />
    </div>
    <span slot="footer" v-if="footerVisible">
      <el-button
        class="editor-button"
        @click="onEdit"
      >
        编辑
      </el-button>
      <!-- <el-button
        class="status-button"
        @click="onDeactivate"
      >
        {{ statusButtonLabel }}
      </el-button> -->
    </span>
  </el-dialog>
</template>

<script>
import BpmnInfo from '@/component/BpmnInfo.vue';
import { updateWorkFlow } from '@/api/managerWorkflow';
import { mapState } from 'vuex';

export default {
  name: 'LookBpmn',
  components: {
    BpmnInfo,
  },
  props: {
    projectData: {
      type: Object,
      default: {},
    },
    visible: {
      type: Boolean,
      default: false,
    },
    footerVisible: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState('account', ['userInfo', 'currentOrganization']),
    isPublicProject() {
      return this.projectData.ascription === 'public';
    },
    statusButtonLabel() {
      return this.projectData.status === 'enabled' ? '停用' : '启用';
    },
    processDisplayInfo() {
      if (this.isPublicProject) {
        return [
          {
            label: '流程编码',
            value: this.projectData.processCode,
          },
          {
            label: '流程名称',
            value: this.projectData.processName,
          },
          {
            label: '创建时间',
            value: this.projectData.createTime,
          },
          {
            label: '创建人',
            value: this.projectData.creatorName,
          },
          {
            label: '流程描述',
            value: this.projectData.processDesc,
          },
        ];
      }
      return [
        {
          label: '流程编码',
          value: this.projectData.processCode,
        },
        {
          label: '流程名称',
          value: this.projectData.processName,
        },
        {
          label: '创建时间',
          value: this.projectData.createTime,
        },
        {
          label: '创建人',
          value: this.projectData.creatorName,
        },
        {
          label: '应用项目',
          value: this.projectData.applicationName,
        },
        {
          label: '流程描述',
          value: this.projectData.processDesc,
        },
      ];
    },
  },
  methods: {
    onEdit() {
      this.$emit('edit', this.projectData, '查看');
    },
    onDeactivate() {
      const file1 = new File(
        [this.projectData.processFile],
        this.projectData.processName + '.bpmn',
        {
          type: 'bpmn20-xml',
        }
      );
      let formData = new FormData();
      formData.set('id', this.projectData.id);
      formData.set('name', this.projectData.name);
      formData.set('docName', this.projectData.name + '.bpmn');
      if (this.projectData.ascription) {
        formData.set('ascription', this.projectData.ascription);
      } else {
        formData.set('ascription', this.currentOrganization);
      }
      formData.set('code', this.projectData.code);
      formData.set('business', this.projectData.business);
      if (this.projectData.status === 'disabled') {
        formData.set('status', 'enabled');
      } else {
        formData.set('status', 'disabled');
      }
      formData.set('createBy', this.userInfo.account);
      formData.set('updateBy', this.userInfo.account);
      formData.set('tenantId', '18');
      formData.set('file', file1);
      updateWorkFlow(formData).then(() => {
        this.$message.success(
          this.projectData.status === 'disabled' ? '启用成功' : '停用成功'
        );
        this.close();
      });
    },
    close() {
      this.$emit('close');
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style scoped lang="scss">
.editor-button {
  @include primaryBtn;
}

.status-button {
  @include resetBtn;
}
</style>
