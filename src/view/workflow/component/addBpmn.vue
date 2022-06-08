<template>
  <el-dialog title="新建流程"
             :visible="dialogVisible"
             width="90%"
             custom-class="dialogVisible"
             @close="close">
    <div class="dialogVisible-main">
      <bpmnJsELe :xmlString="xmlString"
                 :name="formData.name"
                 v-if="dialogVisible"></bpmnJsELe>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="publish()">发布</el-button>
      <el-button @click="confirm()">保存</el-button>
      <el-button @click="cancel()">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  workFlowSaveDraft,
  workFlowSave,
  publishWorkflow,
} from '@/api/managerWorkflow'
import bpmnJsELe from '@/view/bpmnJsELe/index.vue'
import X2JS from 'x2js'

export default {
  components: {
    bpmnJsELe,
  },
  props: {
    flag: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    publick: {
      type: String,
      default: '',
    },
    currentRowData: {
      type: Object,
      default: () => ({
        name: '',
        id: '',
      }),
    },
    xmlString: {
      type: String,
      default: '',
    },
    pubFlag: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modeler: null,
      postData: {
        name: '',
      },
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.bpmnJsELe) {
        this.$refs.bpmnJsELe.$refs.panel.$refs.baseInfo.elementBaseInfo.name =
          this.formData.name
      }
    })
  },
  methods: {
    async publish() {
      try {
        await this.$iBpmn.validate()
        const newConvert = new X2JS()
        const { xml } = await this.$iBpmn.saveXML({
          format: true,
        })
        const { definitions } = newConvert.xml2js(xml)
        var file1 = new File([xml], definitions.process._name + '.bpmn', {
          type: 'bpmn20-xml',
        })
        let formData = new FormData()
        if (this.currentRowData?.id) {
          formData.append('id', this.currentRowData.id)
        }
        let names = ''
        if (definitions?.process._name) {
          names = definitions.process._name
        }
        if (this.formData?.name) {
          names = this.formData.name
        }
        if (this.currentRowData?.name) {
          names = this.currentRowData.name
        }

        formData.append('name', names)
        formData.append('docName', names + '.bpmn')
        if (this.publick) {
          formData.append('ascription', 'public')
        } else {
          formData.append('ascription', this.$parent.projectCode)
        }

        formData.append('code', definitions.process._id)
        formData.append('business', 'zhihuiyunwei')
        formData.append('status', 'enabled')
        formData.append('createBy', this.$store.state.userInfo.name)
        formData.append('updateBy', this.$store.state.userInfo.name)
        formData.append('tenantId', this.$store.state.tenantId)
        formData.append('file', file1)
        // 已发布的 走修改的流程
        if (this.pubFlag) {
          formData.append('id', this.currentRowData.id)
          workFlowSaveDraft(formData).then(() => {
            this.$message.success('保存成功')
            this.$emit('close')
            this.$parent.findWorkFlowRecord()
          })
        } else {
          publishWorkflow(formData).then(() => {
            this.$message.success('发布成功')
            this.$emit('close')
            this.$parent.findWorkFlowRecord('enabled,disabled')
          })
        }
        this.$emit('confirm')
      } catch (e) {
        this.$message({
          type: 'error',
          message: '流程设计存在错误/警告',
        })
      }
    },
    cancel() {
      this.$emit('close')
    },
    close() {
      this.$emit('close')
    },
    async confirm() {
      try {
        await this.$iBpmn.validate()
        let names
        const newConvert = new X2JS()
        const { xml } = await this.$iBpmn.saveXML({
          format: true,
        })
        const { definitions } = newConvert.xml2js(xml)
        if (definitions.process._name) {
          names = definitions.process._name
        }
        if (this.formData.name) {
          names = this.formData.name
        }
        if (this.currentRowData.name) {
          names = this.currentRowData.name
        }
        var file1 = new File([xml], names + '.bpmn', {
          type: 'bpmn20-xml',
        })
        let formData = new FormData()
        formData.append('id', this.currentRowData.id)
        formData.append(
          'name',
          this.currentRowData.name ||
            this.formData.name ||
            definitions.process._name
        )
        formData.append(
          'docName',
          definitions.process._name + '.bpmn' ||
            this.currentRowData.name + '.bpmn' ||
            this.formData.name + '.bpmn'
        )
        if (this.flag && Object.values(this.formData).length > 0) {
          formData.append('ascription', this.$parent.projectCode)
        } else {
          formData.append('ascription', 'public')
        }

        formData.append('code', definitions.process._id)
        formData.append('business', 'zhihuiyunwei')
        formData.append('status', 'drafted')
        formData.append('createBy', this.$store.state.userInfo.name)
        formData.append('updateBy', this.$store.state.userInfo.name)
        formData.append('tenantId', this.$store.state.tenantId)
        formData.append('file', file1)
        this.flag
          ? workFlowSave(formData).then(() => {
              this.$message.success('保存成功')
              this.$emit('close')
              this.$parent.findWorkFlowRecord('drafted')
            })
          : workFlowSaveDraft(formData).then(() => {
              this.$message.success('保存成功')
              this.$emit('close')
              this.$parent.findWorkFlowRecord('drafted')
            })
        this.$emit('confirm')
      } catch (error) {
        this.$message({
          type: 'error',
          message: '流程设计存在错误/警告',
        })
      }
    },
  },
}
</script>

<style scoped>
.dialogVisible-main {
  height: 80vh;
}
</style>
