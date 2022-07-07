<template>
  <div class="statistics-wrapper">
    <div>
      <div class="data-wrapper">
        <div class="icon">
          <img :src="require('../../../assets/image/history/total-month.svg')" />
        </div>
        <div class="title">{{ headerNum.currentMonthAccumulateProcessCount }}</div>
        <div class="label">当月累计工作流</div>
      </div>
      <div class="data-wrapper">
        <div class="icon">
          <img :src="require('../../../assets/image/history/completed-month.svg')" />
        </div>
        <div class="title">{{ headerNum.currentMonthCompleteProcessCount }}</div>
        <div class="label">当月完成工作流</div>
      </div>
      <div class="data-wrapper">
        <div class="icon">
          <img :src="require('../../../assets/image/history/online-month.svg')" />
        </div>
        <div class="title">{{ headerNum.currentMonthAvgTime }}</div>
        <div class="label">平均完成时长</div>
      </div>
    </div>
    <div>
      <div class="data-wrapper">
        <div class="icon">
          <img :src="require('../../../assets/image/history/total-day.svg')" />
        </div>
        <div class="title">{{ headerNum.currentDayAccumulateProcessCount }}</div>
        <div class="label">当日累计工作流</div>
      </div>
      <div class="data-wrapper">
        <div class="icon">
          <img :src="require('../../../assets/image/history/completed-day.svg')" />
        </div>
        <div class="title">{{ headerNum.currentDayCompleteProcessCount }}</div>
        <div class="label">当日完成工作流</div>
      </div>
      <div class="data-wrapper">
        <div class="icon">
          <img :src="require('../../../assets/image/history/online-day.svg')" />
        </div>
        <div class="title">{{ headerNum.currentDayAvgTime }}</div>
        <div class="label">平均完成时长</div>
      </div>
    </div>
  </div>
</template>
<script>
import { postHistoryProcessCountStatistic } from '@/api/historyWorkflow.js'
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
      business: '',
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

<style scoped lang="scss">
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
      background: #d1ebfb;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &:first-child {
      margin-right: 20px;
      flex-grow: 1;
    }

    &:last-child {
      margin-left: 20px;
      flex-grow: 1;

      .data-wrapper {
        cursor: pointer;
      }

      .icon {
        background-color: #d4fdd9;
      }
    }
  }
}
</style>
