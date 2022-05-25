<template>
  <div class="history_head">
    <el-select  v-model="projectValue">
      <el-option v-for="item in projectOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-select  v-model="systemValue">
      <el-option v-for="item in systemOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-select v-model="statusValue">
      <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <div class="history_date">
      <span class="datePickTitle">创建时间</span>
      <el-date-picker v-model="valueDate" type="daterange" align="right" unlink-panels range-separator="——"
                      start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button @click="$emit('searchHistory', valueDate) " style="margin-left: 15px" type="primary">查询</el-button>
    </div>

  </div>
</template>

<script>
    export default {
      data() {
        return {
          valueDate: [],
          projectValue: '1',
          systemValue: '1',
          statusValue: '1',
          statusOption: [
            {
              value: '1',
              label: '全部状态'
            },
            {
              value: '2',
              label: '待执行'
            },
            {
              value: '3',
              label: '执行中'
            },
            {
              value: '4',
              label: '已完成'
            }
          ],
          projectOption: [
            {
              value: '1',
              label: '全部项目'
            }
          ],
          systemOption: [
            {
              value: '1',
              label: '能源系统'
            }
          ],
        }
      }
    }
</script>

<style scoped>
.container .history_head {
  display: flex;
  padding-top: 15px;
}
.history_head .datePickTitle {
  margin-right: 10px;
  font-size: 14px;
  font-weight: 400;
}
</style>