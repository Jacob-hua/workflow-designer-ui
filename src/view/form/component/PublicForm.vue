<template>
  <div class="PublicForm">
    <div class="PublicForm-title">
      <div class="datePick">
        <span class="datePickTitle">创建时间</span>
        <el-date-picker
          v-model="valueDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="——"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          clearable
        >
        </el-date-picker>
        <span class="datePickTitle">表单</span>
        <el-input
          style="width: 260px"
          v-model="input"
          placeholder="请输入表单名称"
          clearable
        ></el-input>
      </div>
      <div class="PublicForm-title-input">
        <!-- <el-button class="primary" type="primary" @click="getFormList()"
          >查询</el-button
        > -->

        <div>
          <el-button class="primary" type="primary" @click="getFormList()"
            >查询</el-button
          >
        </div>
        <div>
          <el-button class="reset" @click="reset()" type="primary"
            >重置</el-button
          >
        </div>
      </div>
      <div class="PublicForm-title-button">
        <div class="boxBtn" @click="addForm()">新建表单</div>
      </div>
    </div>
    <div class="content-wrapper">
      <div
        class="home-table-card"
        v-for="(item, index) in commonFormList"
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
      <div class="noData" v-if="this.pageInfo.total === 0">暂无数据</div>
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
    <PublicFormDiolog
      :title="publicFormTitle"
      :form-info="formInfo"
      ref="PublicFormDiolog"
      :addFormDialogVisible="addFormDialogVisible"
      :formDesignerVisible="formDesignerVisible"
      @addSuccess="addSuccess()"
      @changeAddFormVisible="changeAddFormVisible"
      @changeFormDesignerVisible="changeFormDesignerVisible"
    ></PublicFormDiolog>
    <detailsDiolog
      tileText="编辑表单"
      ref="detailsDiolog"
      :visible="detailDialogVisible"
      :formDatas="formData"
      @editForm="editForm"
      @handleCloseDetail="handleCloseDetail"
      @deleteSuccsee="deleteSuccsee()"
    ></detailsDiolog>
  </div>
</template>

<script>
import PublicFormDiolog from './PublicFormComponent/index.vue';
import detailsDiolog from './details.vue';
import longText from '../../../component/LongText.vue';
import { fetchFormList } from '../../../api/workflowForm';
import { mapState } from 'vuex';
export default {
  components: {
    PublicFormDiolog,
    detailsDiolog,
    longText,
  },
  data() {
    return {
      formData: {},
      valueDate: [],
      input: '',
      formStatus: 'enabled',
      commonFormList: [],
      formListSecond: [],
      pageInfo: {
        page: 1,
        limit: 8,
        total: 0,
      },
      detailDialogVisible: false,
      formDesignerVisible: false,
      addFormDialogVisible: false,
      publicFormTitle: '新建表单',
      formInfo: null,
    };
  },
  async mounted() {
    await this.getFormList();
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId']),
  },
  methods: {
    async getFormList() {
      const { data, code, msg } = await fetchFormList({
        bindType: 'common',
        formName: this.input ?? '',
        startTime: this.valueDate?.[0] ?? '',
        endTime: this.valueDate?.[1] ?? '',
        limit: this.pageInfo.limit,
        page: this.pageInfo.page,
      });
      if (code !== '200') {
        this.$message.error(msg);
      }
      this.commonFormList = data.dataList;
      this.pageInfo.total = Number(data.total);
    },
    reset() {
      this.pageInfo.page = 1;
      this.input = '';
      this.valueDate = [];
      this.getFormList();
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
      this.getEnableData();
    },
    handleCloseDetail() {
      this.formInfo = null;
      this.detailDialogVisible = false;
    },

    deleteSuccsee() {
      this.detailDialogVisible = false;
      this.pageInfo = {
        page: 1,
        limit: 8,
        total: 0,
      };
      this.getFormList();
    },

    addSuccess(value) {
      this.detailDialogVisible = false;
      this.addFormDialogVisible = false;
      this.formInfo = null;
      localStorage.removeItem('formVersionFile');
      this.getFormList();
    },
    addForm() {
      this.addFormDialogVisible = true;
      this.publicFormTitle = '新建表单';
    },
    addForm2(item, tileText) {
      this.formDesignerVisible = true;
      this.formInfo = item;
      this.$nextTick(() => {
        this.publicFormTitle = tileText;
      });
    },
    changeAddFormVisible(visible) {
      this.addFormDialogVisible = visible;
    },
    changeFormDesignerVisible(visible) {
      this.formDesignerVisible = visible;
    },
    detailsDiolog(item) {
      this.formData = item;
      this.detailDialogVisible = true;
    },
    editForm(item, tileText) {
      this.addForm2(item, tileText);
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .el-tabs__content {
  padding: 50px 20px;
}

/deep/ .el-dialog {
  @include formDialog;
}
.noData {
  color: #fff;
}

.PublicForm-title {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  align-items: center;
}
.content-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 40px;
  grid-gap: 30px;
}
.primary {
  @include primaryBtn;
}

.reset {
  @include resetBtn;
}
.boxBtn {
  font-size: 14px;
  color: #009efb;
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #009efb;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 20px;
}

.datePick {
  display: inline-block;
}
.datePickTitle {
  width: 56px;
  height: 14px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  line-height: 20px;
  margin-right: 10px;
  margin-left: 10px;
}

.PublicForm-title-input {
  display: flex;
  grid-gap: 15px;
}
.PublicForm-title-button {
  display: flex;
  justify-content: right;
}
.home-main {
  margin-top: 40px;
}

.home-main-tab {
  display: flex;
}

.home-main-tab-item {
  color: #9f9fa0;
  display: inline-block;
  height: 60px;
  width: 200px;
  line-height: 60px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
}

.active {
  background-color: #030303;
  color: white;
  font-weight: 600;
  border-top: 2px solid #176cf4;
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
  height: 30px;
  line-height: 30px;
  background-color: #212739;
  color: #fff;
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
  font-size: 14px;
}
.card-main-item .label {
  display: inline-block;
  width: 90px;
  vertical-align: top;
  color: #999999;
}
.card-main-item .value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: top;
  color: #fff;
}
.pagination-box {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
