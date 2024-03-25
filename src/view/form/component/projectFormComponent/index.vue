<template>
  <div>
    <el-dialog
      :title="title"
      @close="close"
      :close-on-click-modal="false"
      :visible.sync="addFormDialogVisible"
    >
      <div class="guid">
        <el-form
          ref="guideForm"
          label-width="80px"
          label-position="right"
          :rules="rules4NewFormGuide"
          :model="postData"
        >
          <div class="from-item">
            <el-form-item label="应用项目" prop="business">
              <el-cascader
                v-model="postData.business"
                clearable
                :style="{ width: '100%' }"
                :options="projectOrganizations()"
                :props="{
                  emitPath: true,
                  checkStrictly: true,
                }"
              >
              </el-cascader>
            </el-form-item>
          </div>
          <div class="from-item">
            <el-form-item label="表单名称" prop="formName">
              <el-input
                v-model="postData.formName"
                placeholder="请输入表单名称"
              ></el-input>
            </el-form-item>
          </div>
          <div class="from-item">
            <el-form-item label="表单描述" prop="formDesc">
              <el-input
                v-model="postData.formDesc"
                placeholder="请输入表单描述"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="next" @click="nextDiolog()" type="primary">下一步</div>
        <div class="cancel" @click="close">取消</div>
      </div>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="formDesignerVisible"
      fullscreen
      @close="closeForm"
      top="1vh"
      custom-class="dialogVisibleEdit"
    >
      <div class="dialogVisible2-main">
        <el-form
          ref="newOrEditForm"
          :rules="rules4NewForm"
          :model="postData"
          label-width="100px"
          label-position="right"
        >
          <div class="form-title">
            <div class="title-item">
              <el-form-item
                label="表单名称"
                class="title-item-label"
                prop="formName"
              >
                <div class="title-item-main">
                  <el-input
                    v-model="postData.formName"
                    placeholder=""
                    :disabled="title !== '新建表单'"
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
        </el-form>
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

import { mapGetters, mapState } from 'vuex';
import { Loading } from 'element-ui';

export default {
  components: {
    formVersion,
  },
  props: {
    title: {
      type: String,
      default: '新建表单',
    },
    addFormDialogVisible: {
      type: Boolean,
      default: false,
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
  computed: {
    ...mapState('uiConfig', ['cascaderProps']),
    ...mapGetters('config', ['projectOrganizations']),
  },
  data() {
    return {
      rules4NewFormGuide: {
        business: [
          { required: true, message: '请选择表单类型', trigger: 'change' },
        ],
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
      rules4NewForm: {
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
      postData: {
        formId: '',
        formName: '',
        formVersionTag: '',
        formVersionDesc: '',
        formVersionSource: null,
        formDesc: '',
        business: [],
        formVersion: '',
        createTime: '',
      },
      options: [],
      microApp: null,
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
          formVersionId: value.formVersionId,
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
  mounted() {
    this.addGlobalStateChangeListener();
  },

  methods: {
    close() {
      this.$emit('changeAddFormVisible', false);
    },
    closeForm() {
      this.removeGlobalStateChangeListener();
      if (this.microApp) {
        this.microApp.unmount();
      }
      this.$refs['guideForm']?.resetFields();
      this.$refs['guideForm']?.clearValidate();
      this.$refs['newOrEditForm']?.resetFields();
      this.$refs['newOrEditForm']?.clearValidate();
      this.$emit('changeFormDesignerVisible', false);
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
      let loadingInstance = Loading.service({
        text: '表单设计器加载中',
        body: true,
      });
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
      if (this.microApp) {
        this.$nextTick(() => {
          // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
      }
    },
    nextDiolog() {
      this.$refs['guideForm'].validate((valid) => {
        if (valid) {
          this.$emit('changeAddFormVisible', false);
          this.$emit('changeFormDesignerVisible', true);
          this.$nextTick(() => {
            this.title = '新建表单';
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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
          this.closeForm();
          return;
        }
        await this.$refs['newOrEditForm'].validate();
        let formData = new FormData();
        formData.append('formId', this.postData.formId);
        formData.append('formVersionDesc', this.postData.formVersionDesc);
        formData.append('formVersionFile', formFile);
        formData.append('formVersionSource', this.postData.formVersionId);
        formData.append('formVersionTag', this.postData.formVersionTag);
        const { code, msg } = await addFormVersion(formData);
        if (code !== '200') {
          this.$message.error(msg);
          return;
        }
        this.$message.success('保存成功');
        this.$emit('addSuccess');
      } else {
        await this.$refs['newOrEditForm'].validate();
        let formData = new FormData();
        formData.append('tenantId', this.postData.business[0] ?? '');
        formData.append('projectId', this.postData.business[1] ?? '');
        formData.append('applicationId', this.postData.business[2] ?? '');
        formData.append('bindType', 'bind');
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
      this.closeForm();
    },

    addGlobalStateChangeListener() {
      const _this = this;
      actions.onGlobalStateChange((value) => {
        if (value.tagInfo === 'cancle') {
          _this.closeForm();
          return;
        }
        _this.formVersionVisible = true;
      });
    },
    removeGlobalStateChangeListener() {
      actions.offGlobalStateChange();
    },
  },
  beforeDestroy() {
    this.removeGlobalStateChangeListener();
  },
};
</script>

<style scoped lang="scss">
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
/deep/.el-dialog__body {
  padding: 10px 30px !important;
}
.el-select,
.el-cascader {
  width: 100%;
}
.title-item {
  display: inline-block;
  margin-bottom: 10px;
}

.title-item-label {
  margin-right: 15px;
  color: white;
}

.title-item-main {
  display: inline-block;
}

.marginLeft40 {
  margin-left: 70px;
}

.form-Main {
  height: 650px;
  overflow: auto;
}

.form-title #form {
  height: 100%;
  background-color: aliceblue;
}
</style>
