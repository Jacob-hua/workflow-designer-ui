<template>
  <div>
    <el-dialog
      title="关联表单"
      :visible="dialogVisible"
      width="70%"
      fullscreen
      custom-class="dialogVisibleEdit"
      top="1vh"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="diologMain">
        <div class="diologMain-right">
          <el-scrollbar class="center-scrollbar">
            <div
              class="processList-item"
              v-for="(item, index) in formList"
              :key="index"
            >
              <div class="processList-item-word">
                <p>表单名称:</p>
                <span>{{ item.formName }}</span>
              </div>
              <div class="processList-item-word">
                <p>版本名称:</p>
                <span>{{ item.formVersionTag }}</span>
              </div>
              <div class="processList-item-wor d">
                <p>版本:</p>
                <span>{{ item.formVersion }}</span>
              </div>
              <div class="processList-item-word">
                <p>创建人:</p>
                <span>{{item.creatorName }}</span>
              </div>
              <div class="processList-item-word">
                <p>创建时间:</p>
                <span>{{ item.createTime }}</span>
              </div>
              <div class="processList-item-button">
                <div class="refence" @click="open(item)">关联</div>
              </div>
            </div>
          </el-scrollbar>

          <el-dialog
            @close="close"
            title="表单"
            :visible.sync="dialogVisibleModal"
            :close-on-click-modal="false"
            width="35%"
            custom-class="dialogVisible1"
            append-to-body
          >
            <div class="container">
              <el-form
                ref="form"
                :rules="rules"
                label-width="120px"
                label-position="right"
                :model="postData"
              >
                <div class="from-item">
                  <el-form-item label="表单类型" prop="business">
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
                <div class="from-item">
                  <el-form-item label="表单版本名称" prop="formVersionTag">
                    <el-input
                      v-model="postData.formVersionTag"
                      placeholder="请输入表单版本名称"
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="from-item">
                  <el-form-item label="表单版本描述" prop="formVersionDesc">
                    <el-input
                      v-model="postData.formVersionDesc"
                      placeholder="请输入表单版本描述"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <div class="next" @click="onSure()" type="primary">确定</div>
              <div class="cancel" @click="close">取消</div>
            </div>
          </el-dialog>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { fetchFormVersionList, bindCommonFormToBussiness } from '../../../../api/workflowForm';

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rules: {
        business: [
          { required: true, message: '请输入资源标识', trigger: 'change' },
        ],
        formName: [
          { required: true, message: '请输入表单名称', trigger: 'blur' },
          {
            min: 0,
            max: 100,
            message: '长度在 0 到 100 个字符',
            trigger: 'blur',
          },
        ],
        formVersionTag: [
        { required: true, message: '请输入表单版本名称', trigger: 'blur' },
          {
            min: 0,
            max: 100,
            message: '长度在 0 到 100 个字符',
            trigger: 'blur',
          },
        ]
      },
      dialogVisibleModal: false,
      postData: {
        formDesc: '',
        business: [],
        formName: '',
        formVersionDesc:'',
        formVersionTag: ''
      },
      pageInfo: {
        page: 1,
        limit: 9999,
      },
      formList: [],
      currentData: null,
    };
  },
  computed: {
    ...mapGetters('config', ['projectOrganizations']),
  },
  watch: {
    dialogVisible(value){
      if(value){
        this.getFormList();
      }
    }
  },
  methods: {
    close() {
      this.dialogVisibleModal = false;
      this.currentData = null;
      this.$refs.form.clearValidate();
      this.$refs.form.resetFields();
    },
    handleClose() {
      this.$emit('close');
    },
    async getFormList() {
      const {data,code,msg} = await fetchFormVersionList({
        limit: this.pageInfo.limit,
        page: this.pageInfo.page,
        bindType: 'common'
      });

      if(code!=='200'){
        this.$message.error(msg);
        return;
      }
      this.formList = data.dataList;
    },
    async onSure() {
      await this.$refs['form'].validate();
      const {code, msg} = await bindCommonFormToBussiness({
        tenantId: this.postData.business[0]??'',
        projectId: this.postData.business[1]??'',
        applicationId: this.postData.business[2]??'',
        formName: this.postData.formName,
        formDesc: this.postData.formDesc,
        formVersionTag: this.postData.formVersionTag,
        formVersionDesc: this.postData.formVersionDesc,
        commonFormVersionId: this.currentData.formVersionId
      });
      if(code!=='200'){
        this.$message.error(msg);
        return;
      }
      this.close();
      this.$message.success("关联成功");
    },
    open(item) {
      this.currentData = item;
      this.dialogVisibleModal = true;
    },
  },
  mounted() {
    // this.getFormList();
  },
};
</script>

<style scoped lang="scss">
.center-scrollbar {
  height: 85vh !important;
  margin-left: 102px;
}
.center-scrollbar /deep/ .el-scrollbar__bar.is-horizontal {
  display: none;
}
.center-scrollbar /deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}

/deep/ .dialogVisibleEdit {
  width: 100% !important;
}
/deep/ .el-dialog {
  @include formDialog;

  .el-dialog__body {
    padding: 20px;
  }
}
.next {
  @include primaryBtn;
}
.cancel {
  @include cancelBtn;
}
.diologMain {
  display: flex;
}
.refence {
  cursor: pointer;
  color: #0dd5ef;
  padding-left: 180px;
}
.diologMain-left {
  flex: 2;
  text-align: center;
  height: 695px;
}

.diologMain-right {
  flex: 8;
  margin-left: 20px;
  height: 695px;
  padding: 0px 20px;
}
.energyList {
  margin-top: 30px;
}
.energyList-item {
  width: 220px;
  height: 44px;
  line-height: 44px;
  border: 1px solid #000000;
  margin: 0 auto;
  cursor: pointer;
}
.checkPro {
  border-color: #0066cc;
  color: #0066cc;
}
.processList {
  height: 590px;
  overflow-y: auto;
}
.processList-item {
  width: 312px;
  height: 224px;
  background-color: #212739;
  padding: 20px 0px 0px 20px;
  position: relative;
  margin-right: 20px;
  display: inline-block;
  margin-top: 30px;
  padding-bottom: 10px;
}
.processList-item p {
  display: inline-block;
  color: #999999;
  width: 80px;
  margin-right: 15px;
}
.processList-item span {
  color: #fff;
}
.processList-item-detail {
  position: absolute;
  right: 20px;
  top: 10px;
  color: #1890ff;
  cursor: pointer;
}

.processList-item-word {
  font-size: 14px;
  color: #000000;
}
.processList-item-button {
  text-align: center;
}
.process-page {
  text-align: right;
  margin-top: 20px;
  margin-right: 20px;
}
</style>
