<template>
  <el-dialog title="新建流程" :visible="dialogVisible" width="90%" custom-class="dialogVisible" @close="close">
    <div class="dialogVisible-main">
      <bpmnJsELe @initModeler="initModeler" :xmlString="xmlString" v-if="dialogVisible"></bpmnJsELe>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="publish()">发布</el-button>
      <el-button @click="confirm()">保存</el-button>
      <el-button @click="cancel()">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  workFlowSaveDraft,
  workFlowSave, publishWorkflow
} from '@/api/managerWorkflow'
  import bpmnJsELe from '@/views/bpmnJsELe/index.vue'
  import X2JS from "x2js";
  import {
    postDesignDesignService
  } from '@/unit/api.js'
  export default {
    props: {
      flag: {
        type: Boolean,
        default: false
      },
      formData: {
        type: Object,
        default: {
          name: ''
        }
      },
      dialogVisible: {
        type: Boolean,
        default: false
      },
      publick: {
        type: String,
        default: ''
      },
      currentRowData: {
        type: Object,
        default:  {
          name: '',
          id: ''
        }
      },
      xmlString: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        modeler: null,
        postData: {
          name: ''
        }
      }
    },
    methods: {
      publish() {
        let _this = this
        const newConvert = new X2JS();
        this.modeler.saveXML({
          format: true
        }).then(({
                   xml
                 }) => {
          const {
            definitions
          } = newConvert.xml2js(xml);
          var file1 = new File([xml], definitions.process._name + '.bpmn', {
            type: 'bpmn20-xml'
          });
          console.log(definitions)
          let formData = new FormData()
          if (_this.currentRowData.id) {
            formData.append('id', _this.currentRowData.id )
          }
          let names = ''
          if (_this.currentRowData.name) {
            names = _this.currentRowData.name
          }
          if ( _this.formData.name) {
            names =  _this.formData.name
          }
          if (definitions.process._name) {
            names = definitions.process._name
          }
          formData.append('name', names)
          formData.append('docName',   names+ '.bpmn')
          if (_this.publick) {
            formData.append('ascription', 'public')
          } else {
            formData.append('ascription', 'beiqijia')
          }

          formData.append('code', definitions.process._id)
          formData.append('business', 'zhihuiyunwei')
          formData.append('status', 'enabled')
          formData.append('createBy', 'admin')
          formData.append('tenantId', '18')
          formData.append('file', file1)
          publishWorkflow(formData).then(res => {
            this.$message.success('发布成功')
            // this.$router.push('/home')
            this.$emit('close')
            this.$parent.findWorkFlowRecord()
          })
        });
        this.$emit('confirm')

      },

      cancel() {
        this.$emit('close')
      },
      close() {
        this.$emit('close')
      },
      initModeler(value) {
        this.modeler = value
      },
      confirm() {
        let _this = this
        const newConvert = new X2JS();
        this.modeler.saveXML({
          format: true
        }).then(({
          xml
        }) => {
          const {
            definitions
          } = newConvert.xml2js(xml);
          var file1 = new File([xml], definitions.process._name + '.bpmn', {
            type: 'bpmn20-xml'
          });
          console.log(definitions)
          console.log(this.currentRowData)
          console.log(_this.currentRowData)
          let formData = new FormData()
            formData.append('id', _this.currentRowData.id )
          formData.append('name', _this.currentRowData.name || _this.formData.name)
          formData.append('docName',  _this.currentRowData.name? _this.currentRowData.name+'bpmn' : _this.formData.name + '.bpmn')
          formData.append('ascription', 'beiqijia')
          formData.append('code', definitions.process._id)
          formData.append('business', 'zhihuiyunwei')
          formData.append('status', 'drafted')
          formData.append('createBy', 'admin')
          formData.append('tenantId', '18')
          formData.append('file', file1)
          this.flag?
              workFlowSave(formData).then((res) => {
            this.$message.success('保存成功')
            // this.$router.push('/home')
                this.$emit('close')
                this.$parent.findWorkFlowRecord()

          })
          :
          workFlowSaveDraft(formData).then((res) => {
            this.$message.success('保存成功')
            // this.$router.push('/home')
            this.$emit('close')
            this.$parent.findWorkFlowRecord()
          })
        });
        this.$emit('confirm')
      }
    },
    components: {
      bpmnJsELe
    }
  }
</script>

<style scoped="scoped">
 /* /deep/ .el-dialog__body {
    height: 80vh;
  } */

  .dialogVisible-main {
    height: 80vh;
  }
</style>
