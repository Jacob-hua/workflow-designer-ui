<template>
  <div>
    <el-dialog
      :title="title"
      @close="close"
      :close-on-click-modal="false"
      :visible.sync="addFormDialogVisible"
      :close-on-press-escape="false"
      :destroy-on-close="true"
    >
      <div class="guid">
        <el-form
          ref="guideForm"
          label-width="80px"
          label-position="right"
          :rules="rules4NewFormGuide"
          :model="formBaseInfo"
        >
          <div class="from-item">
            <el-form-item label="表单名称" prop="formName">
              <el-input
                v-model="formBaseInfo.formName"
                placeholder="请输入表单名称"
              ></el-input>
            </el-form-item>
          </div>
          <div class="from-item">
            <el-form-item label="表单描述" prop="formDesc">
              <el-input
                v-model="formBaseInfo.formDesc"
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
      fullscreen
      @close="closeForm"
      :visible.sync="formDesignerVisible"
      width="90%"
      custom-class="dialogVisibleEdit"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="newOrEditForm"
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
            <div class="title-item"  v-if="title !== '新建表单'">
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
            <div class="title-item" v-if="title !== '新建表单'">
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
            <div class="title-item" v-if="title !== '新建表单'">
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
          {
            trigger: 'blur',
            validator: (_, value, callback) => {
              let flag = /[a-zA-Z0-9\u4e00-\u9fa5\-_]+$/.test(value);
              if (flag) {
                callback();
              } else {
                callback(
                  new Error('表单名称只能是中文、数字、字母、下划线和中划线!')
                );
              }
            },
          },
        ],
        formDesc: [
          {
            min: 0,
            max: 200,
            message: '表单描述长度在 0 到 200 个字符',
            trigger: 'blur',
          },
        ],
      },
      rules4NewFormGuide: {
        formName: [
          { required: true, message: '请输入表单名称', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '表单名称长度在 1 到 100 个字符',
            trigger: 'blur',
          },
          {
            trigger: 'blur',
            validator: (_, value, callback) => {
              let flag = /[a-zA-Z0-9\u4e00-\u9fa5\-_]+$/.test(value);
              if (flag) {
                callback();
              } else {
                callback(
                  new Error('表单名称只能是中文、数字、字母、下划线和中划线!')
                );
              }
            },
          },
        ],
        formDesc: [
          {
            min: 0,
            max: 200,
            message: '表单描述长度在 0 到 200 个字符',
            trigger: 'blur',
          },
        ],
      },
      dialogVisible2: false,
      input: '',
      options: [],
      formBaseInfo: {
        formName: '',
        formDesc: '',
      },
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
      this.formBaseInfo = {
        formName: '',
        formDesc: '',
      };
      localStorage.removeItem('formVersionFile');
      this.$emit('changeAddFormVisible', false);
    },
    closeForm() {
      this.removeGlobalStateChangeListener();
      if (this.microApp) {
        localStorage.removeItem('formVersionFile');
        this.microApp.unmount();
      }
      this.$refs['guideForm']?.resetFields();
      this.$refs['guideForm']?.clearValidate();
      this.$refs['newOrEditForm']?.resetFields();
      this.$refs['newOrEditForm']?.clearValidate();
      this.$emit('changeFormDesignerVisible', false);
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

    domChanged() {
      setTimeout(() => {
        const selectDomList = document.getElementsByClassName(
          'ant-select-dropdown'
        );
        const modalDomList = document.getElementsByClassName('ant-modal-wrap');
        const designebleDom = document.getElementById(
          '__qiankun_microapp_wrapper_for_form_designer__'
        );
        if (designebleDom) {
          designebleDom.style.height = '100%';
        }
        for (let i = 0; i < selectDomList.length; i++) {
          selectDomList[i].style.zIndex = 9999;
        }
        for (let i = 0; i < modalDomList.length; i++) {
          modalDomList[i].style.zIndex = 9999;
        }
      }, 200);
    },
    mutationObserverDom() {
      const mutationObserver = new MutationObserver(this.domChanged);

      mutationObserver.observe(document.body, {
        childList: true,
      });
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
        this.mutationObserverDom();
      }
    },
    nextDiolog() {
      this.postData = {
        ...this.postData,
        ...this.formBaseInfo,
      };
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
      if (this.formInfo) {
        if (this.formInfo.formVersionFile === newFormFile) {
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
  // height: 700px;
  overflow: auto;
  #designer-app {
    height: 100%;
  }
}
#form {
  height: 100%;
  background-color: aliceblue;
}
</style>
