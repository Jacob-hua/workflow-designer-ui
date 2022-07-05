<template>
  <div>
    <el-dialog title="新建表单" :visible.sync="dialogVisible2" width="90%" custom-class="dialogVisible2">
      <div class="dialogVisible2-main">
        <div class="form-title">
          <div class="title-item">
            <span class="title-item-label">
              表单名称
            </span>
            <div class="title-item-main">
              <el-input v-model="postData.name" placeholder=""></el-input>
            </div>
          </div>
        </div>
        <div class="form-Main">
          <form-designer ref="formDesigner"></form-designer>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addEnableForm()">发布</el-button>
        <el-button @click="addDraftForm()">保存</el-button>
        <el-button @click="dialogVisible2 = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import formbpmn from '../formBpmn.vue'
  import { postFormDesignService, postFormDesignServiceRealiseProcessData } from '@/api/unit/api.js'
  import {
    FormEditor
  } from '@bpmn-io/form-js-editor';
  import { mapState } from 'vuex'
  export default {
    props:{
      dataType: {
        type: String,
        default: 'enabled'
      }
    },
    data() {
      return {
        dialogVisible2: false,
        input: '',
        options: [],
        postData: {
          name: ''
        }
      }
    },
    computed: {
        ...mapState('account', ['userInfo', 'tenantId'])
    },
    methods:{
      nextDiolog() {
        this.dialogVisible2 = true
      },
      addEnableForm() {
        
        if (!this.postData.name) {
          this.$message.error('请填写表单名称')
          return
        }
        
        if (this.postData.name.length <= 2) {
          this.$message.error('表单名称的长度必须大于两个字符')
          return
        }


        let formDatas = { list : this.$refs.formDesigner.designList, config: this.$refs.formDesigner.formConfig}
        if ( formDatas.list.length === 0) {
          this.$message.error('不允许提交空表单')
          return
        }
        const id = 'form_' + Date.parse(new Date())
        var file1 = new File([JSON.stringify(formDatas)], 'form.json', {type: 'text/json'});
        let formData = new FormData()
        switch (this.dataType){
          case 'enabled':
            break;
          case 'drafted':
            break;
          case 'enabled-edit':
            formData.append('sourceId', this.postData.sourceId)
            break;
          case 'drafted-edit':
            formData.append('id', this.postData.id)
            formData.append('sourceId', this.postData.sourceId)
            break;
          default:
            break;
        }
        if(this.postData.id) {
          formData.append('id', this.postData.id)
          formData.append('sourceId', this.postData.sourceId)
        }
        formData.append('name', this.postData.name)
        formData.append('docName', this.postData.name +'.json')
        formData.append('docType', 'json')
        formData.append('ascription', 'public')
        formData.append('code', id)
        formData.append('business', '')
        formData.append('status', 'enabled')
        formData.append('createBy', this.userInfo.account)
        formData.append('createName', this.userInfo.name)
        formData.append('tenantId', this.tenantId)
        formData.append('file', file1)
        postFormDesignServiceRealiseProcessData(formData).then((res) => {
          this.$message.success('发布至可用表单成功')
          this.$emit('addSuccess', 'enabled')
          this.dialogVisible2 = false
        })
      },
      addDraftForm() {
         const id = 'form_' + Date.parse(new Date())
        const formFile= new File([this.$refs.formDesigner.getFormData()], 'form.json', {type: 'text/json'});
        let formData = new FormData()
        switch (this.dataType){
          case 'enabled':
            break;
          case 'drafted':
            break;
          case 'enabled-edit':
            formData.append('sourceId', this.postData.sourceId)
            break;
          case 'drafted-edit':
            formData.append('id', this.postData.id)
            formData.append('sourceId', this.postData.sourceId)
            break;
          default:
            break;
        }
        formData.append('name', this.postData.name)
        formData.append('docName', this.postData.name +'.json')
        formData.append('docType', 'json')
        formData.append('ascription', 'public')
        formData.append('code', id)
        formData.append('business', '')
        formData.append('status', 'drafted')
        formData.append('createBy', this.userInfo.account)
        formData.append('createName', 'admin')
        formData.append('tenantId', this.tenantId)
        formData.append('file', formFile)
        postFormDesignService(formData).then((res) => {
          this.$message.success('保存草稿成功')
          this.$emit('addSuccess', 'drafted')
          this.dialogVisible2 = false
        })
      }
    },
    components:{
      formbpmn
    }
  }
</script>

<style scoped="scoped">
/*  /deep/ .dialogVisible2 .el-dialog__body {
    padding: 16px 180px 0px 100px;
  } */
  
  >>> .dialogVisible2 .el-dialog__header .el-dialog__title {
    font-size: 14px;
  }

  
  .from-item {
    display: flex;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .from-item>span {
    width: 100px;
    height: 40px;
    line-height: 40px;
  }
  >>> .el-dialog__footer {
    text-align: center;
  }
  
  .form-title {
    border-bottom: 1px solid #CCCCCC;
    margin-bottom: 40px;
  }
  .title-item {
    display: inline-block;
    margin-bottom: 20px;
  }
  .title-item-label {
    margin-right: 15px;
  }
  .title-item-main {
    display: inline-block;
  }
  .marginLeft40 {
    margin-left: 70px;
  }
  .form-Main {
    height: 630px;
  }
  
  #form {
    height: 100%;
    background-color: aliceblue;
  }
</style>
