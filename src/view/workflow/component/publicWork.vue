<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true">
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.valueDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="——"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工作流">
          <el-input
            v-model="searchForm.processName"
            placeholder="请输入工作流名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="button-wrapper">
        <el-button class="search-button" @click="refreshWorkFlowRecord"
          >查询</el-button
        >
        <el-button class="reset-button" @click="onReset">重置</el-button>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="tool-wrapper">
        <el-button class="create-button" @click="onAddBpmnShow"
          >新建工作流</el-button
        >
      </div>
      <div class="project-table">
        <projectTable
          :searchForm="searchFormData"
          bindType="common"
          @lookBpmnShow="onLookBpmnShow"
          @deleteRow="onProjectDeleteRow"
        ></projectTable>
      </div>
    </div>
    <addPublicWork
      :visible.sync="addPublicVisible"
      @submit="onAddPublicSubmit"
    ></addPublicWork>
    <addBpmn
      publick="publick"
      :visible="addBpmnVisible"
      :projectData="projectData"
      bindType="common"
      @close="onAddBpmnClose"
      @submit="onAddBpmnSubmit"
    ></addBpmn>
    <lookBpmn
      v-if="lookBpmnVisible"
      valueType="public"
      :projectData="projectData"
      :visible="lookBpmnVisible"
      @close="onLookBpmnClose"
      @edit="onLookBpmnEdit"
    ></lookBpmn>
  </div>
</template>

<script>
import projectTable from './projectTable.vue';
import addBpmn from './addBpmn.vue';
import lookBpmn from './lookBpmn.vue';
import addPublicWork from './addPublicWork.vue';
import { mapState } from 'vuex';
import { currentOneMonthAgo } from '@/util/date';

export default {
  components: {
    projectTable,
    addBpmn,
    lookBpmn,
    addPublicWork,
  },
  data() {
    return {
      searchForm: {
        ascription: 'public',
        valueDate: [],
        processName: '',
      },
      searchFormData: {},
      projectData: {},
      addBpmnVisible: false,
      lookBpmnVisible: false,
      addPublicVisible: false
    };
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
  },
  mounted() {
    this.refreshWorkFlowRecord();
  },
  methods: {
    async onAddBpmnShow() {
      // this.addBpmnVisible = true;
      // this.resetProjectData();
      this.addPublicVisible = true;
    },
    onReset() {
      this.searchForm = {
        ...this.searchForm,
        valueDate: [],
        processName: '',
      };
      this.refreshWorkFlowRecord();
    },
    onAddBpmnClose() {
      this.addBpmnVisible = false;
      this.resetProjectData();
    },
    onAddBpmnSubmit() {
      this.addBpmnVisible = false;
      this.resetProjectData();
      this.refreshWorkFlowRecord();
    },
    onLookBpmnShow(row) {
      this.setProjectData(row);
      this.lookBpmnVisible = true;
    },
    onLookBpmnClose() {
      this.lookBpmnVisible = false;
      this.resetProjectData();
      this.refreshWorkFlowRecord();
    },
    onLookBpmnEdit(row) {
      this.lookBpmnVisible = false;
      this.setProjectData(row);
      this.addBpmnVisible = true;
    },
    onChangeActiveName() {
      this.refreshWorkFlowRecord();
    },
    onAddPublicSubmit(value) {
      this.addPublicVisible = false;
      this.setProjectData(value);
      this.addBpmnVisible = true;
    },
    onProjectDeleteRow() {},
    onDraftDeleteRow() {},
    resetProjectData() {
      this.projectData = {};
    },
    setProjectData(data) {
      this.projectData = { ...this.projectData, ...data };
    },
    async refreshWorkFlowRecord() {
      this.searchFormData = {
        ...this.searchForm,
        startTime: this.searchForm.valueDate[0],
        endTime: this.searchForm.valueDate[1],
      };
    },
  },
};
</script>

<style scoped lang="scss">
.search-wrapper {
  @include searchForm;

  .button-wrapper {
    display: flex;
    flex-direction: row;

    .search-button {
      @include primaryBtn;
    }

    .reset-button {
      @include resetBtn;
    }
  }
}

.content-wrapper {
  @include contentTab;

  .tool-wrapper {
    display: flex;
    justify-content: flex-end;
  }

  .create-button {
    @include primaryPlainBtn;
  }

  .project-table {
    border: 1px solid #333333;
    margin-top: 10px;
  }
}
</style>
