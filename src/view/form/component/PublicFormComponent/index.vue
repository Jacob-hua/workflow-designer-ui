<template>
  <div>
    <el-dialog
      :title="title"
      fullscreen
      @close="close"
      :visible.sync="formDesignerVisible"
      width="90%"
      custom-class="dialogVisible2"
    >
      <el-form
        ref="form"
        label-width="100px"
        label-position="right"
        :rules="rules"
        :model="postData"
      >
        <div class="dialogVisible2-main">
          <div class="form-title">
            <div class="title-item">
              <el-form-item
                label=" 表单名称"
                class="title-item-label"
                prop="formName"
              >
                <div class="title-item-main">
                  <el-input
                    v-model="postData.formName"
                    :disabled="title !== '新建表单'"
                    placeholder="请输入表单名称"
                  ></el-input>
                </div>
              </el-form-item>
            </div>
            <div class="title-item">
              <el-form-item
                label="版本名称"
                class="title-item-label"
                prop="formVersionTag"
              >
                <div class="title-item-main">
                  <el-input
                    v-model="postData.formVersionTag"
                    placeholder=""
                    disabled
                  ></el-input>
                </div>
              </el-form-item>
            </div>
            <div class="title-item">
              <el-form-item
                label="版本号"
                class="title-item-label"
                prop="formVersion"
              >
                <div class="title-item-main">
                  <el-input
                    v-model="postData.formVersion"
                    placeholder=""
                    disabled
                  ></el-input>
                </div>
              </el-form-item>
            </div>
            <div class="title-item">
              <el-form-item
                label="创建时间"
                class="title-item-label"
                prop="createTime"
              >
                <div class="title-item-main">
                  <el-input
                    v-model="postData.createTime"
                    placeholder=""
                    disabled
                  ></el-input>
                </div>
              </el-form-item>
            </div>
          </div>
          <div class="form-Main">
            <div id="designer-app"></div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="cancel" @click="close">取消</div>
      </div>
    </el-dialog>
    <formVersion
      :formVersionVisible="formVersionVisible"
      @closeVersionDialog="closeVersionDialog"
      @submitFormVersion="submitFormVersion"
    ></formVersion>
  </div>
</template>

<script>
import formVersion from '../formVersion.vue';
import { loadMicroApp } from 'qiankun';
import actions from '../../../../util/actions';
import { addFormInfo, addFormVersion } from '../../../../api/workflowForm';

export default {
  components: {
    formVersion,
  },
  props: {
    title: {
      type: String,
      default: '新建表单',
    },
    formDesignerVisible: {
      type: Boolean,
      default: false,
    },
    formInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      rules: {
        formName: [
          { required: true, message: '请输入表单名称', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '表单名称长度在 1 到 100 个字符',
            trigger: 'blur',
          },
        ],
      },
      dialogVisible2: false,
      input: '',
      options: [],
      postData: {
        formId: '',
        formName: '',
        formVersionTag: '',
        formVersionDesc: '',
        formVersionSource: null,
        formDesc: '',
        formVersion: '',
        createTime: '',
      },
      formVersionVisible: false,
    };
  },
  watch: {
    formInfo(value) {
      if (value) {
        localStorage.setItem('formVersionFile', value.formVersionFile);
        this.postData = {
          ...this.postData,
          formName: value.formName,
          formId: value.formId,
          createTime: value.createTime,
          formVersion: value.formVersion,
          formVersionSource: value.formVersionSource,
          formVersionTag: value.formVersionTag,
        };
      }
    },
    formDesignerVisible(value) {
      if (value) {
        this.addGlobalStateChangeListener();
        this.loadMicroApp();
      }
    },
  },
  methods: {
    close() {
      this.removeGlobalStateChangeListener();
      if (this.microApp) {
        this.microApp.unmount();
      }
      this.$emit('changeFormDesignerVisible', false);
      this.$refs['form'].clearValidate();
      this.$refs['form'].resetFields();
      localStorage.removeItem('formVersionFile');
    },

    closeVersionDialog() {
      this.formVersionVisible = false;
    },
    submitFormVersion(versionForm) {
      this.postData.formVersionTag = versionForm.formVersionTag;
      this.postData.formVersionDesc = versionForm.formVersionDesc;
      this.formVersionVisible = false;
      this.saveForm();
    },

    loadMicroApp() {
      const entry = process.env.QIAN_KUN_URL;
      this.microApp = loadMicroApp(
        {
          name: 'formDesigner',
          entry: `${
            process.env.QIAN_KUN_URL
              ? process.env.QIAN_KUN_URL
              : 'http://127.0.0.1:3000/'
          }`,
          container: '#designer-app',
          props: { actions },
        },
        {
          singular: true,
          fetch(url, ...args) {
            return window.fetch(url, {
              ...args,
              mode: 'cors',
            });
          },
        }
      );
    },

    async saveForm() {
      const newFormFile = localStorage.getItem('formVersionFile') ?? '';
      if (!newFormFile) return;
      if (!JSON.parse(newFormFile).schema.properties) {
        this.$message.error('表单不能为空');
        return;
      }
      const formFile = new File([newFormFile], 'form.json', {
        type: 'text/json',
      });
      if (this.$props.formInfo) {
        if (this.$props.formInfo.formVersionFile === newFormFile) {
          this.close();
          return;
        }
        await this.$refs['form'].validate();
        let formData = new FormData();
        formData.append('formId', this.postData.formId);
        formData.append('formVersionDesc', this.postData.formVersionDesc);
        formData.append('formVersionFile', formFile);
        formData.append('formVersionSource', this.postData.formVersionSource);
        formData.append('formVersionTag', this.postData.formVersionTag);
        const { code, msg } = await addFormVersion(formData);
        if (code !== '200') {
          this.$message.error(msg);
          return;
        }
        this.$message.success('保存成功');
        this.$emit('addSuccess');
      } else {
        await this.$refs['form'].validate();
        formData.append('bindType', 'common');
        formData.append('formDesc', this.postData.formDesc);
        formData.append('formName', this.postData.formName);
        formData.append('formVersionDesc', this.postData.formVersionDesc);
        formData.append('formVersionFile', formFile);
        formData.append('formVersionTag', this.postData.formVersionTag);
        const { code, msg } = await addFormInfo(formData);
        if (code !== '200') {
          this.$message.error(msg);
          return;
        }
        this.$message.success('保存成功');
        this.$emit('addSuccess');
      }
      localStorage.removeItem('formVersionFile');
      this.close();
    },

    addGlobalStateChangeListener() {
      const _this = this;
      actions.onGlobalStateChange((value) => {
        // this.saveForm();
        _this.formVersionVisible = true;
        // console.log(value);
      });
    },
    removeGlobalStateChangeListener() {
      actions.offGlobalStateChange();
    },
  },
  // beforeDestroy() {
  //   this.removeGlobalStateChangeListener();
  // },
};
</script>

<style scoped lang="scss">
/deep/ .el-select {
  width: 100%;
}
.next {
  @include primaryBtn;
}
.cancel {
  @include cancelBtn;
}
.dialog-footer {
  display: flex;
  justify-content: center;
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

.form-title {
  border-bottom: 1px solid #cccccc;
  margin-bottom: 40px;
}
.title-item {
  display: inline-block;
  margin-bottom: 20px;
}
.title-item-label {
  color: white;
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
  overflow: auto;
}
#form {
  height: 100%;
  background-color: aliceblue;
}
</style>
