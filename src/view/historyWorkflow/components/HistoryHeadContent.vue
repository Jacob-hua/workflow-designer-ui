<template>
  <div class="history_head_top">
    <div class="history_head_top_left">
      <div class="his_block">
        <p class="number">{{ headerNum.currentMonthAccumulateProcessCount }}</p>
        <p class="tit">当月累计工作流</p>
      </div>
      <div class="his_block">
        <p class="number">{{ headerNum.currentMonthCompleteProcessCount }}</p>
        <p class="tit">当月完成工作流</p>
      </div>
      <div class="his_block">
        <p class="number">{{ headerNum.currentMonthAvgTime }}</p>
        <p class="tit">平均完成时长</p>
      </div>
    </div>
    <div class="history_head_top_right">
      <div class="his_block">
        <p class="number">{{ headerNum.currentDayAccumulateProcessCount }}</p>
        <p class="tit">当日累计工作流</p>
      </div>
      <div class="his_block">
        <p class="number">{{ headerNum.currentDayCompleteProcessCount }}</p>
        <p class="tit">当日完成工作流</p>
      </div>
      <div class="his_block">
        <p class="number">{{ headerNum.currentDayAvgTime }}</p>
        <p class="tit">平均完成时长</p>
      </div>
    </div>
  </div>
</template>
<script>
import { postHistoryProcessCountStatistic } from '@/api/historyWorkflow.js'
import { getFirstDay, getLastDay } from '@/assets/js/unit.js'
import { mapState } from 'vuex'
import { currentMonthRangeFormat } from '@/util/date.js'

export default {
  data() {
    return {
      headerNum: {
        currentDayAccumulateProcessCount: 0,
        currentDayAvgTime: '0时0分',
        currentDayCompleteProcessCount: 0,
        currentMonthAccumulateProcessCount: 0,
        currentMonthAvgTime: '0时0分',
        currentMonthCompleteProcessCount: 0,
      },
      projectValue: '',
      business: ''
    }
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId']),
  },
  mounted() {
    // this.getHeaderNum()
  },
  methods: {
    getHeaderNum() {
      const { start, end } = currentMonthRangeFormat('YYYY-MM-DD HH:mm:ss')
      postHistoryProcessCountStatistic({
        assignee: this.userInfo.account,
        ascription: this.projectValue,
        business: this.business,
        startTime: start,
        endTime: end,
        tenantId: this.tenantId,
      }).then((res) => {
        this.headerNum = res.result
      })
    },
  },
}
</script>

<style scoped>
.history_head_top {
  display: flex;
  margin-top: 20px;
}
.history_head_top_left {
  margin-right: 80px;
}
.history_head_top_left,
.history_head_top_right {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 707px;
  height: 142px;
  background-color: rgb(242, 242, 242);
  padding-bottom: 25px;
}
.number {
  font-size: 35px;
  text-decoration: none;
  color: rgb(0, 0, 0);
}
.tit {
  font-size: 15px;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
}
.his_block {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>