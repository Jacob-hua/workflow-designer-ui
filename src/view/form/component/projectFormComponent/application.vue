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
      :close-on-press-escape="false"
    >
      <div class="diologMain">
        <div class="diologMain-right">
          <div
            class="processList-item"
            v-for="(item, index) in formList"
            :key="index"
          >
            <div class="processList-item-word">
              <span class="label">表单名称:</span>
              <span class="value">{{ item.formName }}</span>
            </div>
            <div class="processList-item-word">
              <span class="label">版本名称:</span>
              <span class="value">{{ item.formVersionTag }}</span>
            </div>
            <div class="processList-item-word">
              <span class="label">版本:</span>
              <span class="value">{{ item.formVersion }}</span>
            </div>
            <div class="processList-item-word">
              <span class="label">创建人:</span>
              <span class="value">{{ item.creatorName }}</span>
            </div>
            <div class="processList-item-word">
              <span class="label">创建时间:</span>
              <span class="value">{{ item.createTime }}</span>
            </div>
            <div class="processList-item-button">
              <div class="refence" @click="detail(item)">详情</div>
              <div class="refence" @click="open(item)">关联</div>
            </div>
          </div>
        </div>
        <div class="pagination-box">
          <el-pagination
            v-if="this.pageInfo.total"
            @size-change="onSizeChange"
            @current-change="onPageChange"
            :current-page="pageInfo.page"
            :page-size="pageInfo.limit"
            layout="prev, pager, next, jumper"
            :total="pageInfo.total"
          >
          </el-pagination>
        </div>
      </div>
      <el-dialog
        @close="close"
        title="表单"
        :visible.sync="dialogVisibleModal"
        :close-on-click-modal="false"
        width="35%"
        custom-class="dialogVisible1"
        append-to-body
        :close-on-press-escape="false"
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
              <el-form-item label="应用项目" prop="business">
                <el-cascader
                  v-model="postData.business"
                  clearable
                  :style="{ width: '100%' }"
                  :options="projectOrganizations()"
                  :props="{
                    emitPath: true,
                  }"
                >
                </el-cascader>
              </el-form-item>
            </div>
            <div class="from-item">
              <el-form-item label="表单名称" prop="formName">
                <el-input
                  v-model.trim="postData.formName"
                  placeholder="请输入表单名称"
                ></el-input>
              </el-form-item>
            </div>
            <div class="from-item">
              <el-form-item label="表单描述" prop="formDesc">
                <el-input
                  v-model.trim="postData.formDesc"
                  placeholder="请输入表单描述"
                ></el-input>
              </el-form-item>
            </div>
            <div class="from-item">
              <el-form-item label="表单版本名称" prop="formVersionTag">
                <el-input
                  v-model.trim="postData.formVersionTag"
                  placeholder="请输入表单版本名称"
                ></el-input>
              </el-form-item>
            </div>
            <div class="from-item">
              <el-form-item label="表单版本描述" prop="formVersionDesc">
                <el-input
                  v-model.trim="postData.formVersionDesc"
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
    </el-dialog>
    <formVersionDetail :visible="detailDialogVisible" :formDatas="formData" @closeDetail="closeDetail" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  fetchFormVersionList,
  bindCommonFormToBussiness,
} from '../../../../api/workflowForm';
import formVersionDetail from './formVersionDetail.vue';

export default {
  components: {
    formVersionDetail
  },
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
          { required: true, message: '请选择应用项目', trigger: 'change' },
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
        ],
      },
      dialogVisibleModal: false,
      postData: {
        formDesc: '',
        business: [],
        formName: '',
        formVersionDesc: '',
        formVersionTag: '',
      },
      pageInfo: {
        page: 1,
        limit: 15,
      },
      formList: [],
      currentData: null,
      formData: null,
      detailDialogVisible: false
    };
  },
  computed: {
    ...mapGetters('config', ['projectOrganizations']),
  },
  watch: {
    dialogVisible(value) {
      if (value) {
        this.getFormList();
      }
    },
    dialogVisibleModal(value) {
      if(value) {
        this.setDefaultorganization()
      }
    }
  },
  methods: {
    setDefaultorganization() {
      const options = this.projectOrganizations();
      if (options.length <= 0) return;
      this.postData.business = defaultOrg(options[0]);
      function defaultOrg(data) {
        let res = [];
        res.push(data.value);
        if (data.children) {
          res = res.concat(defaultOrg(data.children[0]));
        }
        return res;
      }
    },
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
      const { data, code, msg } = await fetchFormVersionList({
        limit: this.pageInfo.limit,
        page: this.pageInfo.page,
        bindType: 'common',
      });

      if (code !== '200') {
        this.$message.error(msg);
        return;
      }
      this.formList = data.dataList;
      this.pageInfo.total = data.total ? Number(data.total) : 0;
    },
    async onSure() {
      await this.$refs['form'].validate();
      const { code, msg } = await bindCommonFormToBussiness({
        tenantId: this.postData.business[0] ?? '',
        projectId: this.postData.business[1] ?? '',
        applicationId: this.postData.business[2] ?? '',
        formName: this.postData.formName,
        formDesc: this.postData.formDesc,
        formVersionTag: this.postData.formVersionTag,
        formVersionDesc: this.postData.formVersionDesc,
        commonFormVersionId: this.currentData.formVersionId,
      });
      if (code !== '200') {
        this.$message.error(msg);
        return;
      }
      this.close();
      this.$message.success('关联成功');
    },
    open(item) {
      this.currentData = item;
      this.dialogVisibleModal = true;
    },
    detail(item) {
      this.formData = item
      this.detailDialogVisible = true
    },
    closeDetail() {
      this.formData = null
      this.detailDialogVisible = false
    },
    onSizeChange(val) {
      this.pageInfo.limit = val;
      this.getFormList();
    },
    onPageChange(val) {
      this.pageInfo.page = val;
      this.getFormList();
    },
  },
  mounted() {
    // this.getFormList();
    // this.setDefaultorganization()
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
  flex-direction: column;
  grid-gap: 10px;
}
.refence {
  cursor: pointer;
  color: #0dd5ef;
}

.diologMain-right {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 20px;
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
  padding: 20px;
  position: relative;
  display: inline-block;
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
  line-height: 35px;
  height: 35px;

  .label {
    display: inline-block;
    color: #999999;
    width: 80px;
  }

  .value {
    width: calc(100% - 80px);
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    vertical-align: top;
  }
}

.pagination-box {
  text-align: right;
}

.processList-item-button {
  text-align: center;
  display: flex;
  justify-content: flex-end;
  grid-gap: 15px;
}
.process-page {
  text-align: right;
  margin-top: 20px;
  margin-right: 20px;
}
</style>
