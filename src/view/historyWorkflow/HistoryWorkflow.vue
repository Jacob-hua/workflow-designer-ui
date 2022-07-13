<template>
  <div>
    <HistorySearch @searchHistory="searchHistory" ref="searchHistory" />
    <HistoryHeadContent ref="historyHeadContent" />
    <HistoryTable @showDetail="showDetail" ref="historyTable" />
    <lookover
      v-if="lookoverVisible"
      :visible.sync="lookoverVisible"
      :processInstanceId="processInstanceId"
    />
  </div>
</template>
<script>
import HistorySearch from '@/view/historyWorkflow/components/HistorySearch.vue'
import HistoryHeadContent from '@/view/historyWorkflow/components/HistoryHeadContent.vue'
import HistoryTable from '@/view/historyWorkflow/components/HistoryTable.vue'
import Lookover from '@/view/runtime/component/lookover.vue'
import { getHistoryTaskDetail } from '@/api/historyWorkflow.js'

export default {
  name: 'HistoryWorkflow',
  components: {
    HistoryTable,
    HistorySearch,
    HistoryHeadContent,
    Lookover,
  },
  data() {
    return {
      lookoverVisible: false,
      processInstanceId: '',
    }
  },
  mounted() {
    this.$nextTick(async () => {
      await this.$refs.searchHistory.dispatchRefreshOrganization()
      const { projectValue, business } = this.$refs.searchHistory.searchForm
      this.$refs.historyTable.projectValue = projectValue
      this.$refs.historyTable.business = business

      await this.$refs.historyTable.getHistoryTaskList(this.$refs.historyTable.pageInfo)
      this.$refs.historyHeadContent.projectValue = projectValue
      this.$refs.historyHeadContent.business = business
      await this.$refs.historyHeadContent.getHeaderNum()
    })
  },
  methods: {
    searchHistory({ valueDate: dateRang, projectValue, business }) {
      this.$refs.historyTable.dateRang = dateRang
      this.$refs.historyTable.projectValue = projectValue
      this.$refs.historyTable.business = business
      this.$refs.historyTable.getHistoryTaskList(this.$refs.historyTable.pageInfo)
    },
    // 获取任务历史列表
    showDetail(row) {
      this.lookoverVisible = true
      this.processInstanceId = row.processInstanceId
    },
    async fetchHistoryTaskDetail(processInstanceId, assignee) {
      const { errorInfo, result } = await getHistoryTaskDetail({
        processInstanceId,
        assignee,
      })
      if (errorInfo.errorCode) {
        return
      }
      return result
    },
  },
}
</script>
<style></style>
