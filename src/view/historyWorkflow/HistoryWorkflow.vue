<template>
  <div>
    <HistorySearch @searchHistory="searchHistory" ref="searchHistory" />
    <HistoryHeadContent ref="historyHeadContent" />
    <HistoryTable @showDetail="showDetail" ref="historyTable" />
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
  mounted() {
    this.$nextTick(async () => {
      await this.$refs.searchHistory.dispatchRefreshOrganization()
      let projectValue = this.$refs.searchHistory.projectValue
      let business = this.$refs.searchHistory.business
      this.$refs.historyTable.projectValue = projectValue
      this.$refs.historyTable.business = business

      await this.$refs.historyTable.getHistoryTaskList(this.$refs.historyTable.pageInfo)
      this.$refs.historyHeadContent.projectValue = projectValue
      this.$refs.historyHeadContent.business = business
      await this.$refs.historyHeadContent.getHeaderNum()
    })
  },
  methods: {
    searchHistory(dateRang, projectValue, business) {
      this.$refs.historyTable.dateRang = dateRang
      this.$refs.historyTable.projectValue = projectValue
      this.$refs.historyTable.business = business
      this.$refs.historyTable.getHistoryTaskList(this.$refs.historyTable.pageInfo)
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
<style></style>
