<template>
  <div class="container">
      <HistorySearch />
      <HistoryHeadContent/>
      <HistoryTable
        @showDetail="showDetail"
      />
      <LookOver ref="lookover" />
  </div>
</template>
<script>
  import HistorySearch from "@/views/historyWorkflow/components/HistorySearch";
  import HistoryHeadContent from "@/views/historyWorkflow/components/HistoryHeadContent";
  import HistoryTable from "@/views/historyWorkflow/components/HistoryTable";
  import LookOver from "@/views/historyWorkflow/components/Lookover";
  export default {

    components: {
      HistoryTable,
      HistorySearch,
      HistoryHeadContent,
      LookOver
    },
    data() {
      return {

      }
    },
    methods: {
      showDetail(row) {
        this.$refs.lookover.dialogVisible = true
      }
    }

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
  /deep/ .el-radio__inner {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  /deep/ .el-select {
    width: 340px;
    height: 50px;
    margin-right: 18px;
  }
  /deep/.el-radio {
    width: 107px;
    display: flex;
    align-items: center;
    margin-right: 80px;
  }
  /deep/.el-radio div{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .container /deep/ .el-input__inner {
    border: 1px solid black;
  }

  .container /deep/ .el-input__inner {
    border: 1px solid black;
  }
</style>