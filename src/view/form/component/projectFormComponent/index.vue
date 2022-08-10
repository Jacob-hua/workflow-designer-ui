<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible1" >
      <div class="guid">
        <el-form ref="form" label-width="80px" label-position="right" :rules="rules" :model="postData">
          <div class="from-item">
            <el-form-item label="应用项目" prop="ascription">
              <el-select :disabled="true" v-model="postData.ascription">
                <el-option v-for="item in projectOption" :key="item.id" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="from-item">
            <el-form-item label="流程类型"  prop="business">
              <el-cascader
                  ref="cascader"
                  v-model="postData.business"
                  :options="systemOption"
                  :props='sysProps'
                  clearable
                  @change="onOptionClick"
              ></el-cascader>
            </el-form-item>
          </div>
          <div class="from-item">
            <el-form-item label="表单名称"  prop="name">
              <el-input v-model="postData.name" placeholder="请输入表单名称"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="next" @click="nextDiolog()" type="primary">下一步</div>
        <div class="cancel" @click="dialogVisible1 = false">取消</div>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="dialogVisible2" fullscreen top="1vh" custom-class="dialogVisibleEdit">
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
              <el-input v-model="postData.name" placeholder="" maxlength="20"></el-input>
            </div>
          </div>
        </div>
        <div class="form-Main">
          <form-designer ref="formDesigner"></form-designer>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="next" type="primary" @click="addEnableForm()">发布</div>
        <div class="next" @click="addDraftForm()">保存</div>
        <div class="cancel" @click="dialogVisible2 = false">取消</div>
      </div>
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
      default: '新建表单'
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
      rules: {
        ascription: [
          { required: true, message: '请选择应用项目', trigger: 'blur' }
        ],
        business: [
          { required: true, message: '请选择流程类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入表单名称', trigger: 'blur' },
          { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
        ],
      },

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
      this.$refs['form'].validate((valid) => {
        if (valid) {
              this.dialogVisible1 = false
              this.dialogVisible2 = true
                this.$nextTick(() => {
                  this.$refs.formDesigner.clear()
                })
        } else {
          console.log('error submit!!');
          return false;
        }
      });


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
        if (this.postData.status !== 'enabled') {
          formData.append('id', this.postData.id)
        }
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
      if(this.postData.id) {
        formData.append('sourceId', this.postData.sourceId)
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

<style scoped  lang="scss">
.next {
  @include primaryBtn;
}
.cancel {
  @include cancelBtn;
}
/deep/.dialogVisibleEdit {
  width: 100% !important;
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
.el-dialog__body {
  padding: 30px 80px;
}
.el-select, .el-cascader {
  width: 100%;
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

.form-title #form {
  height: 100%;
  background-color: aliceblue;
}
</style>
