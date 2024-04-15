<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true">
        <el-form-item label="业务">
          <el-cascader
            style="margin-right: 10px"
            v-model="searchForm.business"
            :options="projectOrganizations()"
            :props="{
              emitPath: true,
              checkStrictly: true,
            }"
            clearable
          ></el-cascader>
        </el-form-item>
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
            :clearable="true"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="statistics-wrapper">
      <div>
        <div class="data-wrapper">
          <div class="icon">
            <img :src="require('../../assets/image/home/deployed.svg')" />
          </div>
          <div class="title">{{ deployedWorkflowContents }}</div>
          <div class="label">已部署工作流</div>
        </div>
        <div class="data-wrapper">
          <div class="icon">
            <img :src="require('../../assets/image/home/started.svg')" />
          </div>
          <div class="title">{{ WorkflowTableNum }}</div>
          <div class="label">可部署工作流</div>
        </div>
      </div>
      <!-- <div>
        <div class="data-wrapper">
          <div class="icon">
            <img :src="require('../../assets/image/home/executed.svg')" />
          </div>
          <div class="title">
            {{ workflowContents.executionTotalProcessCount }}
          </div>
          <div class="label">操作工作流总数</div>
        </div>
        <div class="data-wrapper">
          <div class="icon">
            <img :src="require('../../assets/image/home/executing.svg')" />
          </div>
          <div class="title">
            {{ workflowContents.executionInProcessCount }}
          </div>
          <div class="label">操作中</div>
        </div>
        <div class="data-wrapper">
          <div class="icon">
            <img :src="require('../../assets/image/home/completed.svg')" />
          </div>
          <div class="title">{{ workflowContents.executionCompleteCount }}</div>
          <div class="label">已完成数量</div>
        </div>
      </div> -->
      <div>
        <div class="data-wrapper" @click="gotoWorkflow">
          <div class="icon">
            <img :src="require('../../assets/image/home/create.svg')" />
          </div>
          <div class="label">新建工作流</div>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <workflow-table
        :searchForm="searchForm"
        ref="workflow"
        @refreshTable="onWorkflowRefresh"
        @deployed="onWorkflowDeployed"
        @saved="onWorkflowSaved"
        @deleted="onWorkflowDeleted"
      ></workflow-table>
    </div>
  </div>
</template>

<script>
import WorkflowTable from './component/WorkflowTable.vue';
import { getDeployCount, getTaskCountStatistic } from '@/api/unit/api.js';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  components: {
    WorkflowTable,
  },
  data() {
    return {
      searchForm: {
        business: [],
        valueDate: [],
      },
      workflowContents: {
        executionCompleteCount: 0,
        executionInProcessCount: 0,
        executionTotalProcessCount: 0,
      },
      activeName: 'workflow',
      WorkflowTableNum: 0,
      draftsTableNum: 0,
      deployedWorkflowContents: 0,
    };
  },
  computed: {
    ...mapGetters('config', ['projectOrganizations']),
  },
  watch: {},
  async mounted() {
    await this.dispatchProjectOriganizations();
    this.setDefaultorganization();
  },
  methods: {
    ...mapActions('config', ['dispatchProjectOriganizations']),
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
    gotoWorkflow() {
      this.$router.push('/home/Workflow');
    },
    totalChange(value, key) {
      this[key] = value;
    },
    getDeployCountList() {
      getDeployCount({
        ascription: this.searchForm.ascription,
        business: this.searchForm.business,
        startTime: this.searchForm.valueDate[0],
        endTime: this.searchForm.valueDate[1],
        status: 'activation',
        tenantId: this.tenantId,
      }).then((res) => {
        this.deployedWorkflowContents = res.result;
      });
    },
    onWorkflowRefresh({ deployCount, deployedCount }) {
      this.WorkflowTableNum = deployCount;
      this.deployedWorkflowContents = deployedCount;
    },
    onWorkflowDeployed() {
      this.getManyData();
    },
    onWorkflowSaved() {
      this.getManyData();
      this.$refs.drafts.fetchWorkflows();
    },
    onWorkflowDeleted() {
      this.getManyData();
    },
    onDraftsDeployed() {
      this.getManyData();
      this.$refs.workflow.fetchWorkflows();
    },
    getManyData() {
      this.getDataNumber();
      this.getDeployCountList();
    },
    getDataNumber() {
      getTaskCountStatistic({
        ascription: this.searchForm.ascription,
        assignee: this.userInfo.account,
        business: this.searchForm.business,
        endTime: this.searchForm.valueDate[1],
        startTime: this.searchForm.valueDate[0],
        tenantId: this.tenantId,
      }).then((res) => {
        if (res) {
          this.workflowContents = res.result;
        } else {
          this.workflowContents = {
            executionCompleteCount: 0,
            executionInProcessCount: 0,
            executionTotalProcessCount: 0,
          };
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.search-wrapper {
  height: 106px;
  background-color: $card-bg-color;
  border-radius: 6px;

  @include searchForm;

  .el-form {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 43px;
  }

  .el-form-item {
    margin-bottom: 0;
  }
}

.statistics-wrapper {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  width: 100%;

  & > div {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background-color: $card-bg-color;
    color: $font-color;
    border-radius: 6px;

    img {
      width: 32px;
      height: 34px;
    }

    .data-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      line-height: 24px;
      font-weight: 400;
      padding: 28px 0px;
    }

    .title {
      margin-top: 16px;
    }

    .label {
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      color: #6e7e88;
      margin-top: 10px;
    }

    .icon {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background: #d4fdd9;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &:first-child {
      margin-right: 20px;
      flex-grow: 2;

      .icon {
        background-color: #d1ebfb;
      }
    }

    &:nth-child(2) {
      flex-grow: 3;
    }

    &:last-child {
      margin-left: 20px;
      flex-grow: 1;

      .data-wrapper {
        cursor: pointer;
      }

      .icon {
        background-color: #009efb;
      }
    }
  }
}

.content-wrapper {
  margin-top: 20px;
}
</style>
