<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true">
        <el-form-item label="编辑时间">
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
        <el-button class="create-button" @click="onAddBpmnShow">新建工作流</el-button>
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
    <addBpmn
      publick="publick"
      :visible="addBpmnVisible"
      :projectData="projectData"
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
import projectTable from './projectTable.vue'
import draftTable from './draftTable.vue'
import addProject from './addProject.vue'
import addBpmn from './addBpmn.vue'
import lookBpmn from './lookBpmn.vue'
import { designProcessCountStatistics } from '@/api/managerWorkflow'
import { mapState } from 'vuex'
import { currentOneMonthAgo } from '@/util/date'

export default {
  components: {
    projectTable,
    draftTable,
    addBpmn,
    lookBpmn,
    addProject,
  },
  data() {
    const { start, end } = currentOneMonthAgo('yyyy-MM-DD HH:mm:ss')
    return {
      searchForm: {
        ascription: 'public',
        valueDate: [start, end],
        name: '',
      },
      searchFormData: {},
      projectValue: '',
      projectData: {},
      activeName: 'enabled,disabled',
      addBpmnVisible: false,
      lookBpmnVisible: false,
      draftProcessCount: 0,
      processCount: 0,
    }
  },
  computed: {
    ...mapState('account', ['tenantId', 'userInfo']),
  },
  mounted() {
    this.refreshWorkFlowRecord()
  },
  methods: {
    async onAddBpmnShow() {
      const uuid = await this.$generateUUID()
      this.addBpmnVisible = true
      this.resetProjectData()
      this.setProjectData({
        code: `process_${uuid}`,
        name: uuid,
      })
    },
    onReset() {
      const { start, end } = currentOneMonthAgo('yyyy-MM-DD HH:mm:ss')
      this.searchForm = {
        ...this.searchForm,
        valueDate: [start, end],
        name: '',
      }
      this.refreshWorkFlowRecord()
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
          tenantId: this.tenantId,
          ascription: 'public',
          startTime: this.searchForm.valueDate[0],
          endTime: this.searchForm.valueDate[1],
          createBy: this.userInfo.account,
          name: this.searchForm.name,
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
}
</style>
