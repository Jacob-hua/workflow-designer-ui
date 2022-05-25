<template>
  <el-dialog title="新建流程" :visible="dialogVisible" width="90%" custom-class="dialogVisible" @close="close">
    <div class="dialogVisible-main">
      <bpmnJsELe ref="bpmnJsELe" @initModeler="initModeler" :xmlString="xmlString" v-if="dialogVisible"></bpmnJsELe>
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
  import bpmnJsELe from '@/view/bpmnJsELe/index.vue'
  // import bpmnJsELe from '@/view/bnpmJs/index.vue'
  import X2JS from "x2js";
  import {
    postDesignDesignService
  } from '@/api/unit/api.js'
  export default {
    props: {
      flag: {
        type: Boolean,
        default: false
      },
      formData: {
        type: Object,
        default: () =>{

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
      },
      pubFlag: {
        type: Boolean,
        default: false
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
    mounted() {
      this.$nextTick(() => {
        console.log(this.formData)
        if (this.$refs.bpmnJsELe) {
          this.$refs.bpmnJsELe.$refs.panel.$refs.baseInfo.elementBaseInfo.name = this.formData.name
        }
      })
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
          if (definitions.process._name) {
            names = definitions.process._name
          }
          if ( _this.formData.name) {
            names =  _this.formData.name
          }
          if (_this.currentRowData.name) {
            names = _this.currentRowData.name
          }

          formData.append('name', names)
          formData.append('docName',   names+ '.bpmn')
          if (_this.publick) {
            formData.append('ascription', 'public')
          } else {
            formData.append('ascription', _this.$parent.projectCode)
          }

          formData.append('code', definitions.process._id)
          formData.append('business', 'zhihuiyunwei')
          formData.append('status', 'enabled')
          formData.append('createBy', this.$store.state.userInfo.name)
          formData.append('updateBy', this.$store.state.userInfo.name)
          formData.append('tenantId', this.$store.state.tenantId)
          formData.append('file', file1)
          // 已发布的 走修改的流程
          if (_this.pubFlag) {
            formData.append('id', _this.currentRowData.id )
            workFlowSaveDraft(formData).then((res) => {
              _this.$message.success('保存成功')
              // this.$router.push('/home')
              _this.$emit('close')
              _this.$parent.findWorkFlowRecord()
            })
          } else  {
            publishWorkflow(formData).then(res => {
              this.$message.success('发布成功')
              // this.$router.push('/home')
              this.$emit('close')
              this.$parent.findWorkFlowRecord('enabled,disabled')
            })
          }

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
        console.log(this.flag)
        let _this = this
        let names
        const newConvert = new X2JS();
        this.modeler.saveXML({
          format: true
        }).then(({
          xml
        }) => {
          const {
            definitions
          } = newConvert.xml2js(xml);
          if (definitions.process._name) {
            names = definitions.process._name
          }
          if (this.formData.name) {
            names = this.formData.name
          }
          if (_this.currentRowData.name) {
            names = _this.currentRowData.name
          }
          var file1 = new File([xml], names + '.bpmn', {
            type: 'bpmn20-xml'
          });
          console.log(definitions)
          console.log(_this.currentRowData)
          let formData = new FormData()
            formData.append('id', _this.currentRowData.id )
          formData.append('name', _this.currentRowData.name || _this.formData.name || definitions.process._name)
          formData.append('docName',  definitions.process._name+ '.bpmn' || _this.currentRowData.name+'.bpmn'|| _this.formData.name + '.bpmn')
          if (_this.flag && Object.values(_this.formData).length > 0) {
            formData.append('ascription', _this.$parent.projectCode)
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
          _this.flag?
              workFlowSave(formData).then((res) => {
                _this.$message.success('保存成功')
                // this.$router.push('/home')
                _this.$emit('close')
                _this.$parent.findWorkFlowRecord('drafted')
              })
          :
              workFlowSaveDraft(formData).then((res) => {
                _this.$message.success('保存成功')
                // this.$router.push('/home')
                _this.$emit('close')
                _this.$parent.findWorkFlowRecord('drafted')
              })

        });
        _this.$emit('confirm')
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
