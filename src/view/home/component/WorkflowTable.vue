<template>
  <div>
    <el-table :data="tableData" v-loading="loading">
      <el-table-column type="index" label="序号" width="180" align="center"> </el-table-column>
      <el-table-column prop="processName" label="名称" width="180" align="center">
      </el-table-column>
      <el-table-column prop="processName" label="流程文件" align="center">
        <template slot-scope="scope">
          <span class="fileStyle">{{ scope.row.processName }}.bpmn</span>
        </template>
      </el-table-column>
      <el-table-column prop="creatorName" label="创建人" align="center"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"> </el-table-column>
      <el-table-column prop="modelCount" label="模型数量" align="center"> </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            @click="onDeploy(scope.row)"
            type="text"
            size="small"
            class="button1"
          >
            部署
          </el-button>
          <el-button @click="onDetails(scope.row)" type="text" size="small">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="onPageSizeChange"
      @current-change="onPageChange"
      :current-page="pageInfo.page"
      :page-size="pageInfo.limit"
      layout="prev, pager, next, jumper"
      :total="pageInfo.total"
    >
    </el-pagination>
    <deploy-confirmation
      :visible="deployConfirmationVisible"
      @submit="onConfirmationSubmit"
      @cancel="handleCloseConfirmation"
    />
    <deploy-options
      :visible.sync="deployOptionsVisible"
      :workflow="workflow"
      @deployed="onDeployed"
      @saved="onSaved"
    />
    <deploy-cabin-detail
      :visible.sync="deployCabinDetailVisible"
      :workflow="workflow"
      @deleted="onDeletedDeploy"
    />
  </div>
</template>

<script>
import { fetchWorkflowList } from '../../../api/workflow';
import { mapState } from 'vuex';
import DeployConfirmation from './DeployConfirmation.vue';
import DeployCabinDetail from './DeployCabinDetail.vue';
import DeployOptions from './DeployOptions.vue';

export default {
  components: {
    DeployConfirmation,
    DeployCabinDetail,
    DeployOptions,
  },
  props: {
    searchForm: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      deployOptionsVisible: false,
      deployConfirmationVisible: false,
      deployCabinDetailVisible: false,
      pageInfo: {
        page: 1,
        limit: 10,
        total: 0,
      },
      tableData: [],
      workflow: {},
    };
  },
  computed: {},
  watch: {
    searchForm: {
      deep: true,
      handler() {
        this.pageInfo.page = 1;
        this.fetchWorkflows();
      },
    },
  },
  methods: {
    onConfirmationSubmit(workflow) {
      this.workflow = { ...this.workflow, ...workflow };
      this.deployOptionsVisible = true;
    },
    handleCloseConfirmation() {
      this.deployConfirmationVisible = false;
    },
    onDeletedDeploy() {
      this.fetchWorkflows();
      this.$emit('deleted');
    },
    onDeployed() {
      this.fetchWorkflows();
      this.$emit('deployed');
    },
    onSaved() {
      this.$emit('saved');
    },
    async fetchWorkflows() {
      this.loading = true;
      const { data, code, msg } = await fetchWorkflowList({
        page: this.pageInfo.page,
        limit: this.pageInfo.limit,
        bindType: 'bind',
        tenantId: this.searchForm.business[0] ?? '',
        projectId: this.searchForm.business[1] ?? '',
        applicationId: this.searchForm.business[2] ?? '',
        startTime: this.searchForm.valueDate[0] ?? '',
        endTime: this.searchForm.valueDate[1] ?? '',
      });
      if (code !== '200') {
        this.$message.error(msg);
        this.loading = false;
        return;
      }
      this.tableData = data.dataList;
      this.pageInfo.total = Number(data.total);
      this.loading = false;
      let deployedCount = 0;
      data.dataList.forEach(({ modelCount }) => {
        if (modelCount > 0) deployedCount++;
      });
      this.$emit('refreshTable', {
        deployCount: Number(data.total),
        deployedCount,
      });
    },
    onPageSizeChange(limit) {
      this.pageInfo.limit = limit;
      this.fetchWorkflows();
    },
    onPageChange(page) {
      this.pageInfo.page = page;
      this.fetchWorkflows();
    },
    onDeploy(row) {
      this.workflow = { ...row };
      this.deployConfirmationVisible = true;
    },
    onDetails(row) {
      this.workflow = { ...row };
      this.deployCabinDetailVisible = true;
    },
  },
};
</script>

<style scoped lang="scss">
.el-pagination {
  text-align: right;
  padding: 34px 0;
}

.fileStyle {
  color: #007edb;
}
</style>
