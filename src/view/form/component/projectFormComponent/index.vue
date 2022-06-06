<template>
  <div>
    <el-dialog title="表单" :visible.sync="dialogVisible1" width="35%" custom-class="dialogVisible1">
      <div>
        <div class="from-item">
          <span>应用项目</span>
          <el-input v-model="projectCodeObj[postData.ascription]" placeholder="请输入应用项目" :disabled="true"></el-input>
        </div>
        <div class="from-item">
          <span>流程类型</span>
          <el-select v-model="postData.business" placeholder="请选择流程类型">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!-- <div class="from-item">
          <span>能源系统</span>
          <el-select v-model="postData.energy" placeholder="请选择能源系统">
            <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div> -->
        <div class="from-item">
          <span>表单名称</span>
          <el-input v-model="postData.name" placeholder="请输入表单名称"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="nextDiolog()" type="primary">下一步</el-button>
        <el-button @click="dialogVisible1 = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="dialogVisible2" width="95%" height="100%" custom-class="dialogVisible2">
      <div class="dialogVisible2-main">
        <div class="form-title">
          <!-- <div class="title-item">
            <span class="title-item-label">
              表单编码
            </span>
            <div class="title-item-main">
              <el-input v-model="postData.code" placeholder="" :disabled="true"></el-input>
            </div>
          </div> -->
          <div class="title-item">
            <span class="title-item-label">
              业务类型
            </span>
            <div class="title-item-main">
              <el-input v-model="projectCodeObj[postData.ascription]" placeholder="" :disabled="true"></el-input>
            </div>
          </div>
          <!-- <div class="title-item">
            <span class="title-item-label marginLeft40">
              能源系统
            </span>
            <div class="title-item-main">
              <el-input v-model="projectCodeObj[postData.energy]" placeholder="" :disabled="true"></el-input>
            </div>
          </div> -->
          <div class="title-item">
            <span class="title-item-label marginLeft40">
              表单名称
            </span>
            <div class="title-item-main">
              <el-input v-model="postData.name" placeholder="" :disabled="true" maxlength="20"></el-input>
            </div>
          </div>
        </div>
        <div class="form-Main">
            <formbpmn ref="formbpmn" v-if="dialogVisible2"></formbpmn>
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
  // import formComponent from '@/plugin/formComponent/index.vue'
  import { postFormDesignService, postFormDesignServiceRealiseProcessData } from '@/api/unit/api.js'
  import {
    FormEditor
  } from '@bpmn-io/form-js-editor';
  export default {
    props:{
      dataType: {
        type: String,
        default: 'enabled'
      },
      title: {
        type: String,
        default: '新增表单'
      }
    },
    data() {
      return {
        dialogVisible1: false,
        dialogVisible2: false,
        projectCodeObj: {
          beiqijia: '北七家人才基地',
          laiwu: '莱芜供热项目',
          xilaideng: '海口喜来登酒店',
          'energy-1': '配电',
          'energy-2': '空压',
          'energy-3': '供暖',
          'energy-4': '空调',
          '': '全部项目'
        },
        postData: {
          ascription: '',
          business: '',
          energy: '',
          name: ''
        },
        options: [
          {
            value: '',
            label: '全部项目'
          }
        ],
        options1: [
          {
            value: 'energy-1',
            label: '配电'
          },
          {
            value: 'energy-2',
            label: '空压'
          },
          {
            value: 'energy-3',
            label: '供暖'
          },
          {
            value: 'energy-4',
            label: '空调'
          },
        ],
        formEditor: null,
        schema: {
          schemaVersion: 1,
          type: "default",
          exporter: {
            name: "form-js",
            version: "0.7.0"
          }
        }
      }
    },
    methods:{
      nextDiolog() {
        if (this.postData.name) {
          if (this.postData.name.length > 2) {
            this.dialogVisible1 = false
            this.dialogVisible2 = true
            this.$nextTick(() => {
              this.$refs.formbpmn.init()
            })
          } else {
            this.$message.error('表单名称必须大于两个字符')
          }
        } else{
          this.$message.error('未填写表单名称')
        }
       
      },
      addEnableForm() {
        const xml  = this.$refs.formbpmn.importData();
        if (xml.components && xml.components.length === 0) {
          this.$message.error('不允许提交空表单')
          return
        }
        xml.id = 'form_' + Date.parse(new Date())
        var file1 = new File([JSON.stringify(xml)], 'test.form', {type: 'text/xml'});
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
        formData.append('docName', this.postData.name +'.form')
        formData.append('docType', '.form')
        formData.append('ascription', this.postData.ascription)
        formData.append('code', xml.id)
        formData.append('business', this.postData.business)
        formData.append('status', 'enabled')
        formData.append('createBy', this.$store.state.userInfo.name)
        formData.append('createName', this.$store.state.userInfo.name)
        formData.append('tenantId', this.$store.state.tenantId)
        formData.append('file', file1)
        postFormDesignServiceRealiseProcessData(formData).then((res) => {
          this.$message.success('发布至可用表单成功')
          this.$emit('addSuccess', 'enabled')
          this.dialogVisible2 = false
        })
      },
      addDraftForm() {
        debugger
        const xml  = this.$refs.formbpmn.importData();
        xml.id = 'form_' + Date.parse(new Date())
        var file1 = new File([JSON.stringify(xml)], 'test.form', {type: 'text/xml'});
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
        formData.append('docName', this.postData.name +'.form')
        formData.append('docType', '.form')
        formData.append('ascription', this.postData.ascription)
        formData.append('code', xml.id)
        formData.append('business', this.postData.business)
        formData.append('status', 'drafted')
        formData.append('createBy', this.$store.state.userInfo.name)
        formData.append('createName', this.$store.state.userInfo.name)
        formData.append('tenantId', this.$store.state.tenantId)
        formData.append('file', file1)
        postFormDesignService(formData).then((res) => {
          this.$message.success('保存草稿成功')
          this.$emit('addSuccess', 'drafted')
          this.dialogVisible2 = false
        })
      },
      async init() {
        const container = this.$refs.form
        this.formEditor = new FormEditor({
          container: container
        });
        this.formEditor.importSchema(this.schema)
        this.formEditor.on('selection.changed', (item) => {
          console.log('选中？', item)
        })
      },
      save() {
        let { href, filename } = this.setEncoded('form', 'test', JSON.stringify(this.formEditor.saveSchema()))
        this.downloadFunc(href, filename);
      },
      downloadProcess() {
        
      },
      // 根据所需类型进行转码并返回下载地址
      setEncoded(type, filename = "diagram", data) {
        const encodedData = encodeURIComponent(data);
        return {
          filename: `${filename}.${type}`,
          href: `data:application/${type === "svg" ? "text/xml" : "bpmn20-xml"};charset=UTF-8,${encodedData}`,
          data: data
        };
      },
      downloadFunc(href, filename) {
        if (href && filename) {
          let a = document.createElement("a");
          a.download = filename; // 指定下载的文件名
          a.href = href; //  URL对象
          a.click(); // 模拟点击
          URL.revokeObjectURL(a.href); // 释放URL对象
        }
      },
      // 加载本地文件
      importLocalFile() {
        const that = this;
        const file = this.$refs.refFile.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          this.formEditor.importSchema(JSON.parse(reader.result))
        }
      },
    },
    components:{
      formbpmn
    }
  }
</script>

<style scoped="scoped">
 /deep/ .dialogVisible1 .el-dialog__body {
    padding: 16px 180px 0px 100px;
  }
  
  /deep/ .dialogVisible1 .el-dialog__header .el-dialog__title {
    font-size: 14px;
  }
  
  /deep/ .dialogVisible1 .el-dialog__header {
    background-color: #e4e4e4;
    border-bottom: 1px solid #000000;
  }
  
  /deep/ .dialogVisible2 .el-dialog__header .el-dialog__title {
    font-size: 14px;
  }
  
  /deep/ .dialogVisible2 .el-dialog__header {
    background-color: #e4e4e4;
    border-bottom: 1px solid #000000;
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
  >>> .form-Main .el-input__inner {
    border-color: #C0C4CC;
  }
 >>> .form-Main .el-input__inner:focus {
   outline: none;
   border-color: #1890ff;
 }
  /deep/ . .el-input__inner {
    color: black;
  }
  
  /deep/ .el-dialog__footer {
    text-align: center;
  }
  
  .form-title {
    border-bottom: 1px solid #CCCCCC;
    /*margin-bottom: 40px;*/
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
  /deep/  .dialogVisible2 .form-title .el-input.is-disabled .el-input__inner {
    color: black;
    width: 180px;
    height: 43px;
    line-height: 43px;
    padding: 0px 10px;
    background-color: #f2f2f2;
  }
  /deep/ .dialogVisible2 .form-title .el-input__inner {
    width: 180px;
    height: 43px;
    line-height: 43px;
    padding: 0px 10px;
    background-color: #f2f2f2;
  }
  .marginLeft40 {
    margin-left: 70px;
  }
  .form-Main {
    height: 630px;
  }

 .form-title #form {
    height: 100%;
    background-color: aliceblue;
  }
</style>
