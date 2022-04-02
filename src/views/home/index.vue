<template>
  <div class="home">
    <div class="home-header">
      <div class="data1">
        <div>
          <div class="title">6</div>
          <div class="titLabel">已部署工作流</div>
        </div>
        <div>
          <div class="title">15</div>
          <div class="titLabel">可部署工作流</div>
        </div>
      </div>
      <div class="data2">
        <div>
          <div class="title">142</div>
          <div class="titLabel">执行工作流总数</div>
        </div>
        <div>
          <div class="title">142</div>
          <div class="titLabel">执行中</div>
        </div>
        <div>
          <div class="title">142</div>
          <div class="titLabel">待执行数量</div>
        </div>
        <div>
          <div class="title">142</div>
          <div class="titLabel">已完成数量</div>
        </div>
      </div>
      <div class="data3">
        <div @click="goBpmn()">
          <div class="title">
            <i class="el-icon-circle-plus"></i>
          </div>
          <div class="titLabel">新建工作流</div>
        </div>
        <!-- <div>
          <div class="title">
            <i class="el-icon-upload"></i>
          </div>
          <div class="titLabel">导入工作流</div>
        </div> -->
      </div>
    </div>
    <div class="home-filter">
      <div class="projectSelect">
        <el-select v-model="value1" placeholder="请选择">
          <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="businessSelect">
        <el-select v-model="value2" placeholder="请选择">
          <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="datePick">
        <span class="datePickTitle">时间</span>
        <el-date-picker v-model="valueDate" type="daterange" align="right" unlink-panels range-separator="——"
          start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable="false">
        </el-date-picker>
      </div>
    </div>
    <div class="home-main">
      <div class="home-main-tab">
        <span class="home-main-tab-item" :class="activeName === 'first' ? 'active' : ''" @click="activeName = 'first'">工作流（1）</span>
        <span class="home-main-tab-item" :class="activeName === 'second' ? 'active' : ''" @click="activeName = 'second'">草稿箱（1）</span>
      </div>
      <div class="home-table">
        <WorkflowTable v-if="activeName === 'first'" :valueDate="valueDate"></WorkflowTable>
        <draftsTable v-if="activeName === 'second'" :valueDate="valueDate"></draftsTable>
      </div>
    </div>
  </div>
</template>

<script>
  import WorkflowTable from './component/WorkflowTable.vue'
  import draftsTable from './component/draftsTable.vue'
  export default {
    data() {
      return {
        valueDate: ['2022-03-30 00:00:00', '2022-04-30 23:59:59'],
        activeName: 'first',
        value1: '',
        value2: '',
        options1: [{
          value: '',
          label: '全部项目'
        }],
        options2: [{
            value: '',
            label: '全部业务'
          },
          {
            value: '1',
            label: '指挥运维'
          },
          {
            value: '2',
            label: '资产管理'
          },
          {
            value: '3',
            label: '人员管理'
          },
          {
            value: '4',
            label: '其他业务'
          },
        ]
      }
    },
    methods: {
      goBpmn() {
        this.$router.push('/bpmn')
      }
    },
    components:{
      WorkflowTable,
      draftsTable
    }
  }
</script>

<style scoped="scoped">
  .home {
    padding-left: 20px;
    padding-top: 20px;
    padding-right: 20px;
  }

  .home-filter /deep/ .el-select .el-input__inner {
    border: 1px solid #000;
    height: 50px;
    line-height: 50px;
    width: 320px;
    font-size: 16px;
    color: #000000;
  }


  .home-header {
    display: flex;
  }

  .data1 {
    width: 400px;
    height: 160px;
    background-color: #f2f2f2;
    margin-right: 10px;
    display: flex;
  }

  .data1>div {
    flex: 1;
    text-align: center;
    padding: 20px 0px;
  }

  .title {
    font-size: 36px;
    height: 100px;
    line-height: 100px;
  }

  .titLabel {
    font-size: 14px;
  }

  .data2 {
    width: 875px;
    height: 160px;
    background-color: #f2f2f2;
    margin-right: 20px;
    display: flex;
  }

  .data2>div {
    flex: 1;
    text-align: center;
    padding: 20px 0px;
  }

  .data3 {
    width: 368px;
    height: 160px;
    background-color: #f2f2f2;
    display: flex;
    cursor: pointer;
  }

  .data3>div {
    flex: 1;
    text-align: center;
    padding: 20px 0px;
  }

  .home-filter {
    margin-top: 20px;
    display: flex;
  }

  .projectSelect {
    margin-right: 20px;
  }

  .businessSelect {
    margin-right: 40px;
  }

  .datePickTitle {
    font-size: 14px;
    color: #000000;
    margin-right: 20px;
  }

  /deep/ .el-date-editor {
    height: 50px;
    border: 1px solid #000000;
    width: 500px;
    color: #000000;
    font-size: 20px;
  }

  .home-main {
    margin-top: 40px;
  }

  .home-main-tab {
    display: flex;
  }

  .home-main-tab-item {
    display: inline-block;
    height: 60px;
    width: 200px;
    line-height: 60px;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid #cccccc;
  }

  .active {
    background-color: #030303;
    color: white;
  }


</style>
