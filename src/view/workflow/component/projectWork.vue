<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true">
        <el-form-item label="业务">
          <el-cascader
            v-model="searchForm.business"
            :options="projectOrganizations()"
            :props="{
              emitPath: true,
              checkStrictly: true,
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="创建时间 ">
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
        <el-button class="create-button" @click="onAddProject">
          新建工作流
        </el-button>
        <el-button class="quote-button" @click="onQuoteBpmnShow">
          关联工作流
        </el-button>
      </div>
      <div class="project-table">
        <projectTable
          :business="projectValue"
          :searchForm="searchFormData"
          bindType="bind"
          @lookBpmnShow="onProjectLookBpmnShow"
          @deleteRow="onProjectDeleteRow"
        ></projectTable>
      </div>
    </div>
    <addProject
      :visible.sync="addProjectVisible"
      @submit="onAddProjectSubmit"
    ></addProject>
    <addBpmn
      v-if="addBpmnVisible"
      :visible.sync="addBpmnVisible"
      :projectData="projectData"
      bindType="bind"
      @close="onAddBpmnClose"
      @submit="onAddBpmnSubmit"
    ></addBpmn>
    <quoteBpmn
      v-if="quoteBpmnVisible"
      :valueDate="searchForm.valueDate"
      :ascription="searchForm.ascription"
      :business="projectValue"
      :visible="quoteBpmnVisible"
      @close="onQuoteBpmnClose"
      @lookBpmn="onLookBpmnShow"
      @quoteBpmn="onQuoteBpmn"
    ></quoteBpmn>
    <lookBpmn
      v-if="lookBpmnVisible"
      :projectData="projectData"
      :visible="lookBpmnVisible"
      :footerVisible="lookBpmnFooterVisible"
      @close="onLookBpmnClose"
      @edit="onLookBpmnEdit"
    ></lookBpmn>
  </div>
</template>

<script>
import projectTable from './projectTable.vue';
import draftTable from './draftTable.vue';
import addProject from './addProject.vue';
import addBpmn from './addBpmn.vue';
import quoteBpmn from './quoteBpmn.vue';
import lookBpmn from './lookBpmn.vue';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

export default {
  components: {
    projectTable,
    draftTable,
    addProject,
    addBpmn,
    quoteBpmn,
    lookBpmn,
  },
  data() {
    return {
      searchForm: {
        ascription:'',
        business: [],
        valueDate: [],
        processName: '',
      },
      searchFormData: {},
      draftProcessCount: 0,
      processCount: 0,
      lookData: null,
      projectValue: [],
      projectData: {},
      addProjectVisible: false,
      addBpmnVisible: false,
      quoteBpmnVisible: false,
      lookBpmnVisible: false,
      lookBpmnFooterVisible: true,
      activeName: 'enabled,disabled',
    };
  },
  computed: {
    ...mapGetters('config', ['projectOrganizations']),
  },
  watch: {},
  async mounted() {
    await this.dispatchProjectOriganizations();
    await this.refreshWorkFlowRecord();
    this.setDefaultorganization();
  },
  methods: {
    ...mapActions('config', [
      'dispatchProjectOriganizations',
    ]),
    setDefaultorganization() {
      const options = this.projectOrganizations();
      if (options.length <= 0) return;
      this.searchForm.business = defaultOrg(options[0]);
      function defaultOrg(data) {
        let res = [];
        res.push(data.value);
        if (data.children) {
          res = res.concat(defaultOrg(data.children[0]));
        }
        return res;
      }
    },
    async onAddProject() {
      this.addProjectVisible = true;
    },
    async onQuoteBpmn(_, row) {
      try {
        const uuid = await this.$generateUUID();
        this.setProjectData({
          ...row,
          code: `process_${uuid}`,
          docName: `${uuid}.bpmn`,
        });
        this.addProjectVisible = true;
      } catch (error) {}
    },
    onReset() {
      this.searchForm = {
        ...this.searchForm,
        business: '',
        valueDate: [],
        processName: '',
      };
      this.refreshWorkFlowRecord();
    },
    onAddProjectSubmit(value) {
      this.addProjectVisible = false;
      this.setProjectData(value);
      this.addBpmnVisible = true;
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
    onQuoteBpmnShow() {
      this.quoteBpmnVisible = true;
    },
    onQuoteBpmnClose() {
      this.quoteBpmnVisible = false;
      this.resetProjectData();
    },
    onProjectLookBpmnShow(row) {
      this.setProjectData(row);
      this.lookBpmnVisible = true;
      this.lookBpmnFooterVisible = true;
    },
    onLookBpmnShow(row) {
      this.setProjectData(row);
      this.lookBpmnVisible = true;
      this.lookBpmnFooterVisible = false;
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
    onDraftTableEdit(row) {
      this.setProjectData(row);
      this.addBpmnVisible = true;
    },
    onChangeActiveName() {
      this.refreshWorkFlowRecord();
    },
    onProjectDeleteRow() {
    },
    onDraftDeleteRow() {
    },
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

  .quote-button {
    @include primaryPlainBtn;
  }

  .project-table {
    border: 1px solid #333333;
    margin-top: 10px;
  }
}
</style>
