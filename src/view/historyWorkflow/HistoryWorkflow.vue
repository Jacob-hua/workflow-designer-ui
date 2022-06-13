<template>
  <div class="container">
    <HistorySearch @searchHistory="searchHistory" />
    <HistoryHeadContent />
    <HistoryTable @showDetail="showDetail"
                  ref="historyTable" />
    <LookOver ref="lookover" />
  </div>
</template>
<script>
import HistorySearch from '@/view/historyWorkflow/components/HistorySearch.vue'
import HistoryHeadContent from '@/view/historyWorkflow/components/HistoryHeadContent.vue'
import HistoryTable from '@/view/historyWorkflow/components/HistoryTable.vue'
import LookOver from '@/view/historyWorkflow/components/Lookover.vue'

export default {
  name: 'HistoryWorkflow',
  components: {
    HistoryTable,
    HistorySearch,
    HistoryHeadContent,
    LookOver,
  },
  data() {
    return {}
  },
  methods: {
    searchHistory(dateRang, projectValue) {
      this.$refs.historyTable.dateRang = dateRang
      this.$refs.historyTable.projectValue = projectValue
      this.$refs.historyTable.getHistoryTaskList(
        this.$refs.historyTable.pageInfo
      )
    },
    // 获取任务历史列表
    showDetail(row) {
      this.$refs.lookover.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.lookover.listData = row.taskList
        this.$refs.lookover.$refs.ProcessInformation.postData = row
        this.$refs.lookover.$refs.ProcessInformation.postData.ascription =
          this.$refs.lookover.$refs.ProcessInformation.postData.businessMap.ascription
        this.$refs.lookover.$refs.ProcessInformation.postData.business =
          this.$refs.lookover.$refs.ProcessInformation.postData.businessMap.business
      })
    },
  },
}
</script>
<style scoped>
.container {
  padding-left: 20px;
  padding-right: 20px;
}

.container .history_head {
  display: flex;
  padding-top: 15px;
}

::v-deep .el-radio__inner {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

::v-deep .el-select {
  width: 340px;
  height: 50px;
  margin-right: 18px;
}

::v-deep .el-radio {
  width: 107px;
  display: flex;
  align-items: center;
  margin-right: 80px;
}

::v-deep .el-radio div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.container ::v-deep .el-input__inner {
  border: 1px solid black;
}

.container ::v-deep .el-input__inner {
  border: 1px solid black;
}
</style>