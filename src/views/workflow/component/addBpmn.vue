<template>
  <el-dialog title="新建流程" :visible="dialogVisible" width="90%" custom-class="dialogVisible" @close="close">
    <div class="dialogVisible-main">
      <bpmnJsELe @initModeler="initModeler" :xmlString="xmlString" v-if="dialogVisible"></bpmnJsELe>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addEnableForm()">发布</el-button>
      <el-button @click="confirm()">保存</el-button>
      <el-button @click="cancel()">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import bpmnJsELe from '@/views/bpmnJsELe/index.vue'
  import X2JS from "x2js";
  import {
    postDesignDesignService
  } from '@/unit/api.js'
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
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
          let formData = new FormData()
          formData.append('name', definitions.process._name)
          formData.append('docName', definitions.process._name + '.bpmn')
          formData.append('ascription', 'beiqijia')
          formData.append('code', definitions.process._id)
          formData.append('business', 'zhihuiyunwei')
          formData.append('status', 'enabled')
          formData.append('createBy', '-1')
          formData.append('createName', 'admin')
          formData.append('tenantId', '18')
          formData.append('file', file1)
          postDesignDesignService(formData).then((res) => {
            this.$message.success('保存成功')
            this.$router.push('/home')
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
