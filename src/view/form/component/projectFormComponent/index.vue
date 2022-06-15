<template>
  <div>
    <el-dialog title="表单" :visible.sync="dialogVisible1" width="35%" custom-class="dialogVisible1">
      <div>
        <div class="from-item">
          <span>应用项目</span>
          <el-select v-model="postData.ascription">
            <el-option v-for="item in projectOption" :key="item.id" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </div>
        <div class="from-item">
          <span style="width: 79px">流程类型</span>
          <el-cascader
              ref="cascader"
              v-model="postData.business"
              :options="systemOption"
              :props='sysProps'
              clearable
              @change="onOptionClick"
          ></el-cascader>
        </div>
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
          <div class="title-item">
            <span class="title-item-label">
              业务类型
            </span>
            <div class="title-item-main">
              <el-input :disabled="true" v-model="postData.ascName"></el-input>
              <el-input v-show="false" v-model="postData.ascription" placeholder="" :disabled="true"></el-input>
            </div>
          </div>
          <div class="title-item">
            <span class="title-item-label marginLeft40">
              表单名称
            </span>
            <div class="title-item-main">
              <el-input v-model="postData.name" placeholder="" :disabled="false" maxlength="20"></el-input>
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
// import formComponent from '@/plugin/formComponent/index.vue'
import {postFormDesignService, putFormDesignService, postFormDesignServiceRealiseProcessData} from '@/api/unit/api.js'
import {
  FormEditor
} from '@bpmn-io/form-js-editor';

import { mapState } from 'vuex'

export default {
  props: {
    dataType: {
      type: String,
      default: 'enabled'
    },
    title: {
      type: String,
      default: '新增表单'
    },
    projectOption: {
      type: Array,
      default: () => {
        []
      }
    },
    systemOption: {
      type: Array,
      default: () => {
        []
      }
    },
    sysProps: {
      type: Object,
      default: () => {
        {
        }
      }
    }
  },
  data() {
    return {
      dialogVisible1: false,
      dialogVisible2: false,
      postData: {
        ascriptionName: '',
        ascName: '',
        ascription: '',
        business: '',
        energy: '',
        name: ''
      },
      options: [],
      options1: [],
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
  computed: {
    ...mapState('account', ['userInfo', 'tenantId'])
  },
  methods: {
    onOptionClick() {
      let nodeInfo = this.$refs.cascader.getCheckedNodes()
      this.postData.ascName = nodeInfo[0].label
    },
    nextDiolog() {
      if (this.postData.name) {
        if (this.postData.name.length > 2) {
          this.dialogVisible1 = false
          this.dialogVisible2 = true
          this.$refs.formDesigner.clear()
        } else {
          this.$message.error('表单名称必须大于两个字符')
        }
      } else {
        this.$message.error('未填写表单名称')
      }

    },
    addEnableForm() {
      let formDatas = {list: this.$refs.formDesigner.designList, config: this.$refs.formDesigner.formConfig}
      if (formDatas.list.length === 0) {
        this.$message.error('不允许提交空表单')
        return
      }
      const id = 'form_' + Date.parse(new Date())
      const formFile = new File([JSON.stringify(formDatas)], 'form.json', {type: 'text/json'});
      let formData = new FormData()
      switch (this.dataType) {
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
        formData.append('sourceId', this.postData.sourceId)
      }
      formData.append('name', this.postData.name)
      formData.append('docName', this.postData.name + '.json')
      formData.append('docType', 'json')
      formData.append('ascription', this.postData.ascription)
      formData.append('code', id)
      formData.append('business', this.postData.business)
      formData.append('status', 'enabled')
      formData.append('createBy', this.userInfo.account)
      formData.append('createName', this.userInfo.name)
      formData.append('tenantId', this.tenantId)
      formData.append('file', formFile)
      postFormDesignServiceRealiseProcessData(formData).then((res) => {
        this.$message.success('发布至可用表单成功')
        this.$emit('addSuccess', 'enabled')
        this.dialogVisible2 = false
      })
    },
    addDraftForm() {
      const id = 'form_' + Date.parse(new Date())
      const formFile = new File([this.$refs.formDesigner.getFormData()], 'form.json', {type: 'text/json'});
      let formData = new FormData()
      switch (this.dataType) {
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
      formData.append('docName', this.postData.name + '.json')
      formData.append('docType', 'json')
      formData.append('ascription', this.postData.ascription)
      formData.append('code', id)
      formData.append('business', this.postData.business)
      formData.append('status', 'drafted')
      formData.append('createBy', this.userInfo.account)
      formData.append('createName', this.userInfo.name)
      formData.append('tenantId', this.tenantId)
      formData.append('file', formFile)
      switch (this.dataType) {
        case 'enabled':
          postFormDesignService(formData).then((res) => {
            this.$message.success('保存草稿成功')
            this.$emit('addSuccess', 'drafted')
            this.dialogVisible2 = false
          })
          break;
        case 'drafted':
          postFormDesignService(formData).then((res) => {
            this.$message.success('保存草稿成功')
            this.$emit('addSuccess', 'drafted')
            this.dialogVisible2 = false
          })
          break;
        case 'enabled-edit':
          postFormDesignService(formData).then((res) => {
            this.$message.success('保存草稿成功')
            this.$emit('addSuccess', 'drafted')
            this.dialogVisible2 = false
          })
          break;
        case 'drafted-edit':
          putFormDesignService(formData).then((res) => {
            this.$message.success('保存草稿成功')
            this.$emit('addSuccess', 'drafted')
            this.dialogVisible2 = false
          })
          break;
        default:
          break;
      }

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
      let {href, filename} = this.setEncoded('form', 'test', JSON.stringify(this.formEditor.saveSchema()))
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
  components: {
    formbpmn
  }
}
</script>

<style scoped="scoped">
>>> .el-cascader {
  width: 320px;
}

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

.from-item > span {
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

/deep/ .dialogVisible2 .form-title .el-input.is-disabled .el-input__inner {
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
