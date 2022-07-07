<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true">
        <el-form-item label="项目选择">
          <el-select v-model="searchForm.ascription">
            <el-option
              v-for="{ id, label, value } in rootOrganizations"
              :key="id"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务选择">
          <el-cascader
            v-model="searchForm.business"
            :key="searchForm.ascription"
            :options="rootOrganizationChildrenAndAll(searchForm.ascription)"
            :props="cascaderProps"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="时间选择 ">
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
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工作流">
          <el-input v-model="searchForm.name" placeholder="请输入工作流名称"></el-input>
        </el-form-item>
      </el-form>
      <div class="button-wrapper">
        <el-button class="search-button" @click="refreshWorkFlowRecord">查询</el-button>
        <el-button class="reset-button" @click="onReset">重置</el-button>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="tool-wrapper">
        <el-button
          class="create-button"
          @click="onAddProject"
          v-role="{ id: 'WorkflowAdd', type: 'button', business: projectValue }"
        >
          新建工作流
        </el-button>
        <el-button
          class="quote-button"
          @click="onQuoteBpmnShow"
          v-role="{ id: 'WorkflowUse', type: 'button', business: projectValue }"
        >
          关联工作流
        </el-button>
      </div>
      <el-tabs v-model="activeName" type="border-card" @tab-click="onChangeActiveName">
        <el-tab-pane name="enabled,disabled">
          <span slot="label">工作流({{ processCount }})</span>
          <projectTable
            :business="projectValue"
            :searchForm="searchFormData"
            @lookBpmnShow="onLookBpmnShow"
            @deleteRow="onProjectDeleteRow"
          ></projectTable>
        </el-tab-pane>
        <el-tab-pane name="drafted">
          <span slot="label">草稿箱({{ draftProcessCount }})</span>
          <draftTable
            :business="projectValue"
            :searchForm="searchFormData"
            @draftTableEdit="onDraftTableEdit"
            @deleteRow="onDraftDeleteRow"
          ></draftTable>
        </el-tab-pane>
      </el-tabs>
    </div>
    <addProject :visible="addProjectVisible" @close="onAddProjectClose" @submit="onAddProjectSubmit"></addProject>
    <addBpmn
      v-if="addBpmnVisible"
      :visible="addBpmnVisible"
      :projectData="projectData"
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
      @close="onLookBpmnClose"
      @edit="onLookBpmnEdit"
    ></lookBpmn>
  </div>
</template>

<script>
import projectTable from './projectTable.vue'
import draftTable from './draftTable.vue'
import addProject from './addProject.vue'
import addBpmn from './addBpmn.vue'
import quoteBpmn from './quoteBpmn.vue'
import lookBpmn from './lookBpmn.vue'
import { designProcessCountStatistics } from '@/api/managerWorkflow'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { currentOneMonthAgo } from '@/util/date'

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
    const { start, end } = currentOneMonthAgo('yyyy-MM-DD HH:mm:ss')
    return {
      searchForm: {
        ascription: '',
        business: '',
        valueDate: [start, end],
        name: '',
      },
      searchFormData: {},
      draftProcessCount: 0,
      processCount: 0,
      lookData: null,
      projectValue: '',
      projectData: {},
      addProjectVisible: false,
      addBpmnVisible: false,
      quoteBpmnVisible: false,
      lookBpmnVisible: false,
      activeName: 'enabled,disabled',
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo', 'currentOrganization']),
    ...mapState('uiConfig', ['cascaderProps']),
    ...mapGetters('config', ['rootOrganizations', 'rootOrganizationChildrenAndAll']),
  },
  watch: {
    'searchForm.ascription'(value) {
      if (value === this.currentOrganization) {
        return
      }
      this.updateCurrentOrganization({ currentOrganization: value })
    },
    currentOrganization: {
      immediate: true,
      handler(value) {
        this.searchForm.ascription = value
      },
    },
  },
  async mounted() {
    await this.dispatchRefreshOrganization()
    await this.refreshWorkFlowRecord()
  },
  methods: {
    ...mapMutations('account', ['updateCurrentOrganization']),
    ...mapActions('config', ['dispatchRefreshOrganization']),
    async onAddProject() {
      const uuid = await this.$generateUUID()
      this.addProjectVisible = true
      this.projectData = {
        code: `process_${uuid}`,
      }
    },
    async onQuoteBpmn(_, row) {
      try {
        const uuid = await this.$generateUUID()
        this.setProjectData({ ...row, code: `process_${uuid}`, docName: `${uuid}.bpmn` })
        this.addProjectVisible = true
      } catch (error) {}
    },
    onReset() {
      const { start, end } = currentOneMonthAgo('yyyy-MM-DD HH:mm:ss')
      this.searchForm = {
        ...this.searchForm,
        business: '',
        valueDate: [start, end],
        name: '',
      }
      this.refreshWorkFlowRecord()
    },
    onAddProjectClose() {
      this.addProjectVisible = false
    },
    onAddProjectSubmit(value) {
      this.addProjectVisible = false
      this.setProjectData(value)
      this.addBpmnVisible = true
    },
    onAddBpmnClose() {
      this.addBpmnVisible = false
      this.resetProjectData()
    },
    onAddBpmnSubmit() {
      this.addBpmnVisible = false
      this.resetProjectData()
      this.refreshWorkFlowRecord()
    },
    onQuoteBpmnShow() {
      this.quoteBpmnVisible = true
    },
    onQuoteBpmnClose() {
      this.quoteBpmnVisible = false
      this.resetProjectData()
    },
    onLookBpmnShow(row) {
      this.setProjectData(row)
      this.lookBpmnVisible = true
    },
    onLookBpmnClose() {
      this.lookBpmnVisible = false
      this.resetProjectData()
      this.refreshWorkFlowRecord()
    },
    onLookBpmnEdit(row) {
      this.lookBpmnVisible = false
      this.setProjectData(row)
      this.addBpmnVisible = true
    },
    onDraftTableEdit(row) {
      this.setProjectData(row)
      this.addBpmnVisible = true
    },
    onChangeActiveName() {
      this.refreshWorkFlowRecord()
    },
    onProjectDeleteRow() {
      this.fetchDesignProcessCountStatistics()
    },
    onDraftDeleteRow() {
      this.fetchDesignProcessCountStatistics()
    },
    resetProjectData() {
      this.projectData = {}
    },
    setProjectData(data) {
      this.projectData = { ...this.projectData, ...data }
    },
    async refreshWorkFlowRecord() {
      await this.fetchDesignProcessCountStatistics()
      this.searchFormData = {
        ...this.searchForm,
        startTime: this.searchForm.valueDate[0],
        endTime: this.searchForm.valueDate[1],
      }
    },
    async fetchDesignProcessCountStatistics() {
      try {
        const { errorInfo, result } = await designProcessCountStatistics({
          ...this.searchForm,
          tenantId: this.tenantId,
          createBy: this.userInfo.account,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
          return
        }

        this.draftProcessCount = result.draftProcessCount
        this.processCount = result.processCount
      } catch (error) {}
    },
  },
}
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
  margin-top: 40px;

  @include contentTab;

  .tool-wrapper {
    float: right;
    position: relative;
    z-index: 99;
    display: flex;
  }

  .create-button {
    @include primaryPlainBtn;
  }

  .quote-button {
    @include primaryPlainBtn;
  }
}
</style>
