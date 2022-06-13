<template>
  <div class="history_head">
    <el-select v-model="projectValue">
      <el-option v-for="{id, label, value} in rootOrganizations"
                 :key="id"
                 :label="label"
                 :value="value"></el-option>
    </el-select>
    <el-cascader style="width: 400px; margin-right: 10px;"
                 v-model="business"
                 :options="rootOrganizationChildren(projectValue)"
                 :props='cascaderProps'></el-cascader>
    <div class="history_date">
      <span class="datePickTitle">创建时间</span>
      <el-date-picker v-model="valueDate"
                      type="daterange"
                      align="right"
                      unlink-panels
                      range-separator="——"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd hh:mm:ss">
      </el-date-picker>
      <el-button @click="$emit('searchHistory', valueDate, projectValue) "
                 style="margin-left: 15px"
                 type="primary">查询</el-button>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'HistorySearch',
  data() {
    return {
      valueDate: [],
      projectValue: '',
      business: '',
      projectOption: [],
      systemOption: [],
    }
  },
  computed: {
    ...mapState('account', ['tenantId']),
    ...mapState('uiConfig', ['cascaderProps']),
    ...mapGetters('config', ['rootOrganizations', 'rootOrganizationChildren']),
  },
  mounted() {
    this.dispatchRefreshOrganization()
  },
  methods: {
    ...mapActions('config', ['dispatchRefreshOrganization']),
  },
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