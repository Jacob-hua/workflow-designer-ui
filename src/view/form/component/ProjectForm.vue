<template>
  <div class="ProjectForm">
    <div class="ProjectForm-title">
      <div class="datePick">
        <span class="text">业务</span>
        <el-cascader
          v-model="business"
          :options="projectOrganizations()"
          :props="{
            emitPath: true,
          }"
        ></el-cascader>
        <span class="text">创建时间</span>
        <el-date-picker
          v-model="valueDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="——"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :clearable="false"
        >
        </el-date-picker>
        <span class="text">表单</span>
        <el-input v-model="formName" placeholder="请输入表单名称"></el-input>
      </div>

      <div class="ProjectForm-title-search">
        <div>
          <el-button class="search" @click="getData()">查询</el-button>
        </div>
        <div>
          <el-button class="reset" @click="reset()" type="primary"
            >重置</el-button
          >
        </div>
      </div>

      <div class="ProjectForm-title-button">
        <div>
          <el-button class="boxBtn" @click="addForm()"> 新建表单 </el-button>
        </div>
        <div>
          <el-button class="boxBtn" @click="application()">
            关联表单
          </el-button>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <div
        class="home-table-card"
        v-for="(item, index) in projectFormList"
        :key="index"
      >
        <div class="card-title">
          <span class="title">{{ item.formCode }}</span>
          <span class="detailWord" @click="detailsDiolog(item)">详情</span>
        </div>
        <div class="card-main">
          <div class="card-main-item">
            <span class="label">表单名称:</span>
            <long-text
              contentStyle="color: white; width: 180px"
              :content="item.formName"
            />
          </div>
          <div class="card-main-item">
            <span class="label">创建人:</span>
            <span class="value">{{ item.creatorName }}</span>
          </div>
          <div class="card-main-item">
            <span class="label">创建时间:</span>
            <span class="value">{{ item.createTime }}</span>
          </div>
          <div class="card-main-item">
            <span class="label">版本个数:</span>
            <span class="value">{{ item.versionNum }}</span>
          </div>
        </div>
      </div>
      <div class="noData" v-if="pageInfo.total === 0">暂无数据</div>
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
    <projectFormDiolog
      :title="projectFormTitle"
      :formInfo="formInfo"
      :addFormDialogVisible="addFormDialogVisible"
      :formDesignerVisible="formDesignerVisible"
      ref="projectFormDiolog"
      @addSuccess="addSuccess()"
      @changeAddFormVisible="changeAddFormVisible"
      @changeFormDesignerVisible="changeFormDesignerVisible"
    ></projectFormDiolog>
    <detailsDiologForm
      tileText="编辑表单"
      :visible="detailDialogVisible"
      ref="detailsDiolog"
      :formDatas="formData"
      @handleCloseDetail="handleCloseDetail"
      @editForm="editForm"
      @deleteSuccsee="deleteSuccsee()"
    ></detailsDiologForm>
    <application
      ref="application"
      :dialogVisible="dialogVisible"
      @close="close()"
    ></application>
  </div>
</template>

<script>
import projectFormDiolog from './projectFormComponent/index.vue';
import detailsDiologForm from './details.vue';
import application from './projectFormComponent/application.vue';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import longText from '../../../component/LongText.vue';
import { fetchFormList } from '../../../api/workflowForm';

export default {
  components: {
    projectFormDiolog,
    detailsDiologForm,
    application,
    longText,
  },
  data() {
    return {
      pageInfo: {
        page: 1,
        limit: 8,
        total: 0,
      },
      formData: {},
      business: [],
      valueDate: [],
      formName: '',
      projectFormList: [],
      dialogVisible: false,
      detailDialogVisible: false,
      projectFormTitle: '新建表单',
      addFormDialogVisible: false,
      formDesignerVisible: false,
      formInfo: null,
    };
  },
  async mounted() {
    await this.dispatchProjectOriganizations();
    this.setDefaultorganization();
    await this.getFormList();
  },
  computed: {
    ...mapGetters('config', ['projectOrganizations']),
  },
  watch: {},
  methods: {
    ...mapActions('config', ['dispatchProjectOriganizations']),
    setDefaultorganization() {
      const options = this.projectOrganizations();
      if (options.length <= 0) return;
      this.business = defaultOrg(options[0]);
      function defaultOrg(data) {
        let res = [];
        res.push(data.value);
        if (data.children) {
          res = res.concat(defaultOrg(data.children[0]));
        }
        return res;
      }
    },
    reset() {
      this.formName = '';
      this.valueDate = [];
      this.pageInfo = {
        page: 1,
        limit: 8,
        total: 0,
      }
      this.setDefaultorganization();
      this.getFormList();
    },
    application() {
      this.dialogVisible = true;
    },
    close() {
      this.dialogVisible = false;
      this.getFormList();
    },
    async getFormList() {
      const { data, code, msg } = await fetchFormList({
        tenantId: this.business[0] ?? '',
        projectId: this.business[1] ?? '',
        applicationId: this.business[2] ?? '',
        bindType: 'bind',
        formName: this.formName ?? '',
        startTime: this.valueDate[0] ?? '',
        endTime: this.valueDate[1] ?? '',
        limit: this.pageInfo.limit,
        page: this.pageInfo.page,
      });
      if (code !== '200') {
        this.$message.error(msg);
      }
      this.projectFormList = data.dataList;
      this.pageInfo.total = Number(data.total);
    },

    onSizeChange(val) {
      this.pageInfo.limit = val;
      this.getFormList();
    },
    onPageChange(val) {
      this.pageInfo.page = val;
      this.getFormList();
    },
    updatePageNum() {
      const totalPage = Math.ceil(
        (this.pageInfo.total - 1) / this.pageInfo.limit
      );
      this.pageInfo.page =
        this.pageInfo.page > totalPage ? totalPage : this.pageInfo.page;
      this.pageInfo.page = this.pageInfo.page < 1 ? 1 : this.pageInfo.page;
    },

    getData() {
      this.pageInfo = {
        page: 1,
        limit: 8,
        total: 0,
      }
      this.getFormList();
    },

    deleteSuccsee() {
      this.detailDialogVisible = false;
      this.getFormList();
    },

    addSuccess() {
      this.detailDialogVisible = false;
      this.addFormDialogVisible = false;
      this.formInfo = null;
      localStorage.removeItem('formVersionFile');
      this.getFormList();
    },

    changeAddFormVisible(visible) {
      this.addFormDialogVisible = visible;
    },

    changeFormDesignerVisible(visible) {
      this.formDesignerVisible = visible;
    },
    addForm() {
      this.addFormDialogVisible = true;
      this.projectFormTitle = '新建表单';
    },

    addForm2(item, tileText) {
      this.formDesignerVisible = true;
      this.formInfo = item;
      this.$nextTick(() => {
        this.projectFormTitle = tileText;
      });
    },
    detailsDiolog(item) {
      this.formData = item;
      this.detailDialogVisible = true;
    },
    editForm(item, tileText) {
      this.addForm2(item, tileText);
    },
    handleCloseDetail() {
      this.formInfo = null
      this.detailDialogVisible = false;
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .el-tabs__content {
  padding: 50px 20px;
}
.noData {
  color: #fff;
}
.text {
  width: 56px;
  height: 14px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  line-height: 20px;
  margin-right: 10px;
  margin-left: 10px;
}

.ProjectForm-title {
  display: grid;
  align-items: center;
  grid-auto-flow: column;
  grid-template-columns: 4fr 2fr 1fr;
  /deep/ .el-input {
    width: 180px;
  }
}

/deep/ .el-date-editor {
  width: 260px;
}

/deep/ .el-dialog {
  @include formDialog;
}

.boxBtn {
  @include primaryPlainBtn;
}

.search {
  @include primaryBtn;
}

.reset {
  @include resetBtn;
}

.checkPro {
  border: 1px solid #0066cc !important;
}

.projectList {
  padding: 0px 0px 20px 0px;
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 20px;
}

.projectList-item {
  position: relative;
  font-size: 18px;
  width: 260px;
  height: 100px;
  line-height: 100px;
  display: inline-block;
  border: 1px solid #cccccc;
  margin-right: 20px;
  padding: 0px 20px;
}

.projectList-item-word {
  vertical-align: super;
  display: inline-block;
  margin-left: 15px;
}

.item-icon {
  position: absolute;
  top: 20px;
  right: 20px;
}

.projectHeader {
  display: inline-block;
  margin: 0px 0px 20px 0px;
}

.datePick {
  display: inline-block;
}

.datePickTitle {
  display: inline-block;
  font-size: 14px;
  margin-right: 20px;
  margin-left: 20px;
}

.ProjectForm-title-option {
  display: inline-block;
  margin-right: 40px;
}

.ProjectForm-title-search {
  display: flex;
  grid-gap: 15px;
}

.ProjectForm-title-button {
  display: flex;
  grid-gap: 20px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 40px;
  grid-gap: 30px
}

.home-table {
  min-height: 786px;
  border: 1px solid #666666;
  margin-bottom: 40px;
  padding: 20px 20px;
}

.home-table-card {
  border: 1px solid #666666;
  min-height: 170px;
  display: inline-block;
  border-radius: 5px;
}

.card-title {
  color: #fff;
  height: 30px;
  line-height: 30px;
  background-color: #212739;
  padding: 0px 20px;
  border-radius: 5px;
}

.card-title .title {
  font-size: 14px;
}

.card-title .detailWord {
  float: right;
  color: #0dd5ef;
  font-size: 14px;
  cursor: pointer;
}

.card-main {
  padding: 10px 10px;
}

.card-main-item {
  line-height: 40px;
  height: 40px;
  color: black;
  font-size: 14px;
}

.card-main-item .label {
  display: inline-block;
  width: 80px;
  color: #999999;
}

.card-main-item .value {
  width: 220px;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: top;
}

.pagination-box {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
