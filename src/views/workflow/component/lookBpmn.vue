<template>
  <el-dialog title="查看" :visible="dialogVisible" width="70%" custom-class="dialogVisible" @close="close">
    <div class="dialogVisible-main">
      <bpmnView ref="bpmnView" :valueType="valueType" @edit="edit()" @quote="quote()"></bpmnView>
    </div>
    <span slot="footer" class="dialog-footer" >
      <el-button v-if="isEdit" @click="edit()">编辑</el-button>
      <el-button v-if="isEdit" @click="Deactivate()">{{rowData.status === 'enabled'? '停用' : '启用'}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import bpmnView from '@/components/bpmnView/index.vue'
  import {workFlowSaveDraft} from "@/api/managerWorkflow";
  export default {
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
      dep: {
        type:String,
        default: ''
      },
      rowData: {
        type: Object,
        default: {}
      },
      dialogVisible: {
        type: Boolean,
        default: false
      },
      valueType: {
        type: String,
        default: 'project'
      },
      showFlag: Boolean
    },
    data() {
      return {
        currentRowData: {},
      }
    },
    mounted() {

      console.log(this.rowData)
    },
    methods:{
      edit() {
        this.$emit('edit', this.rowData, '查看')
      },
      Deactivate() {
        let _this = this

          var file1 = new File([this.currentRowData.content], _this.currentRowData.name + '.bpmn', {
            type: 'bpmn20-xml'
          });
          console.log(this.currentRowData)
          console.log(_this.currentRowData)
          let formData = new FormData()
          formData.append('id', _this.currentRowData.id )
          formData.append('name', _this.currentRowData.name)
          formData.append('docName',  _this.currentRowData.name+'.bpmn' )
          if (_this.currentRowData.ascription) {
            formData.append('ascription', _this.currentRowData.ascription)
          } else {
            formData.append('ascription', 'beiqijia')
          }
          formData.append('code', _this.currentRowData.code)
          formData.append('business', 'zhihuiyunwei')
        if (_this.currentRowData.status === 'disabled') {
          formData.append('status', 'enabled')
        } else {
          formData.append('status', 'disabled')
        }
          formData.append('createBy', 'admin')
          formData.append('tenantId', '18')
          formData.append('file', file1)
        workFlowSaveDraft(formData).then((res) => {
                this.$message.success(_this.currentRowData.status === 'disabled'? '启用成功' : '停用成功')
                // this.$router.push('/home')
                this.$emit('close')
                this.$parent.findWorkFlowRecord('disabled,enabled')
              })
      },
      quote() {
        this.$emit('quote')
      },
      close() {
        this.$emit('close')
      }
    },
    components: {
      bpmnView
    }
  }
</script>

<style>
</style>
