<template>
  <div class="history_head">
    <el-select  @change="projectChange" v-model="projectValue">
      <el-option v-for="item in projectOption" :key="item.id" :label="item.name" :value="item.code"></el-option>
    </el-select>
    <el-cascader
        style="width: 400px; margin-right: 10px;"
        v-model="systemValue"
        :options="systemOption"
        :props = 'sysProps'
        @change="handleChange"></el-cascader>
    <div class="history_date">
      <span class="datePickTitle">创建时间</span>
      <el-date-picker v-model="valueDate" type="daterange" align="right" unlink-panels range-separator="——"
                      start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button @click="$emit('searchHistory', valueDate, projectValue) " style="margin-left: 15px" type="primary">查询</el-button>
    </div>

  </div>
</template>

<script>
import { mapState } from "vuex";
import { getProjectList } from "@/api/globalConfig";
export default {
  data() {
    return {
      sysProps:{
        label: 'name',
        value: 'code'
      },
      valueDate: [],
      projectValue: '1',
      systemValue: '1',
      projectOption: [],
      systemOption: [],
    }
  },
  computed: {
    ...mapState(['tenantId'])
  },
  mounted() {
    this.getProjectList()
  },
  methods: {
    handleChange() {},
    deleteEmptyChildren(arr) {
      for (let i = 0; i < arr.length; i++) {
        const arrElement = arr[i];
        if (!arrElement.children.length) {
          delete arrElement.children
          continue
        }
        if (arrElement.children) {
          this.deleteEmptyChildren(arrElement.children)
        }
      }

    },
    projectChange(val) {
      this.systemOption =  this.projectOption.filter(({ id }) => id === val)[0].children
      this.deleteEmptyChildren(this.systemOption)
      console.log(this.systemOption)
      // this.systemValue = this.systemOption[0]?.id  ??  ''
    },
    async getProjectList(){
      let res = await  getProjectList({
        count: -1,
        projectCode: '',
        tenantId: +this.tenantId,
        type: ''
      })
      this.projectOption = res?.result ?? []
      this.projectValue = this.projectOption[0].code
      this.systemOption = this.projectOption[0].children
      this.deleteEmptyChildren(this.systemOption)
      this.systemValue =  this.systemOption[0].code
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