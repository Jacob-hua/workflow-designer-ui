<template>
  <div>
    <el-dialog
      title="关联工作流"
      :visible="visible"
      top="5vh"
      fullscreen
      @close="close"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
    >
      <div>
        <el-table :data="tableData">
          <el-table-column type="index" label="序号" width="180" align="center">
          </el-table-column>
          <el-table-column prop="processName" label="名称" align="center">
          </el-table-column>
          <el-table-column prop="creatorName" label="创建人" align="center">
          </el-table-column>
          <el-table-column prop="createTime" label="编辑时间" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{ $index, row }">
              <el-button type="text" @click="onLookBpmn('引用', $index, row)"
                >查看</el-button
              >
              <el-button
                type="text"
                @click="onQuoteBpmn('引用工作流', $index, row)"
                >关联</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="getData.page"
          :page-size="getData.limit"
          layout="prev, pager, next, jumper"
          :total="getData.total"
        >
        </el-pagination>
      </div>
    </el-dialog>
    <add-project
      :visible.sync="addProjectVisible"
      title="关联工作流"
      @close="onAddProjectClose"
      @submit="onAddProjectSubmit"
    ></add-project>
  </div>
</template>

<script>
import AddProject from './addProject.vue';
import { fetchWorkflowList, saveWorkflow } from '../../../api/workflow';
import { mapState } from 'vuex';

export default {
  name: 'QuoteBpmn',
  components: {
    AddProject,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      addProjectVisible: false,
      tableData: [],
      getData: {
        page: 1,
        limit: 10,
        total: 1,
      },
      processData: null,
    };
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId']),
  },
  mounted() {
    this.fetchWorkflowList();
  },
  // watch: {
  //   visible(value) {
  //     if(value){
  //       this.fetchWorkflowList()
  //     }
  //   }
  // },
  methods: {
    async fetchWorkflowList() {
      try {
        const { data, code, msg } = await fetchWorkflowList({
          bindType: 'common',
          page: this.getData.page,
          limit: this.getData.limit,
        });
        if (code !== '200') {
          this.$message.error(msg);
          return;
        }
        this.tableData = data.dataList;
        this.getData.total = Number(data.total);
      } catch (error) {}
    },
    async quoteWorkFlow(processFormData) {
      const { code, msg } = await saveWorkflow(processFormData);
      if (code !== '200') {
        this.$message.error(msg);
        return;
      }
      this.addProjectVisible = false;
      this.$message.success('保存成功');
    },
    close() {
      this.processData = null;
      this.$emit('close');
    },
    onLookBpmn(tit, _, row) {
      this.$emit('lookBpmn', row, tit);
    },
    onQuoteBpmn(title, _, row) {
      this.processData = row;
      this.addProjectVisible = true;
      // const newData = { ...row };
      // delete newData.id;
      // this.$emit('quoteBpmn', title, newData);
    },
    // TODO: 关联工作流的业务逻辑需要重新梳理
    onAddProjectClose() {},
    onAddProjectSubmit(value) {
      let processFormData = new FormData();
      processFormData.set('processId', this.processData.processId);
      processFormData.set('tenantId', value.business[0] ?? '');
      processFormData.set('projectId', value.business[1] ?? '');
      processFormData.set('applicationId', value.business[2]) ?? '';
      processFormData.set('bindType', 'bind');
      processFormData.set('processName', value.processName);
      processFormData.set('processDesc', value.processDesc);
      processFormData.set(
        'processFile',
        new File(
          [this.processData.processFile],
          this.processData.processName + '.bpmn',
          {
            type: 'bpmn20-xml',
          }
        )
      );
      // processFormData.set('processFile', this.processData.processFile);
      this.quoteWorkFlow(processFormData);
    },
    handleSizeChange(val) {
      this.getData.limit = val;
      this.fetchWorkflowList();
    },
    handleCurrentChange(val) {
      this.getData.page = val;
      this.fetchWorkflowList();
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .el-table {
  height: calc(100vh - 222px);
}

.el-pagination {
  text-align: right;
  padding: 34px 0;
}
</style>
