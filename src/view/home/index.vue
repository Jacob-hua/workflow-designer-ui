<template>
  <div class="home">
    <div class="home-header">
      <div class="data1">
        <div>
          <div class="title">{{ deployNumber }}</div>
          <div class="titLabel">已部署工作流</div>
        </div>
        <div>
          <div class="title">{{ WorkflowTableNum }}</div>
          <div class="titLabel">可部署工作流</div>
        </div>
      </div>
      <div class="data2">
        <div>
          <div class="title">{{ numberList.executionTotalProcessCount }}</div>
          <div class="titLabel">执行工作流总数</div>
        </div>
        <div>
          <div class="title">{{ numberList.executionInProcessCount }}</div>
          <div class="titLabel">执行中</div>
        </div>
        <div>
          <div class="title">{{ numberList.executionCompleteCount }}</div>
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
        <el-select  @change="projectChange" v-model="value1">
          <el-option v-for="item in projectOption" :key="item.id" :label="item.name" :value="item.code"></el-option>
        </el-select>
<!--        <el-select v-model="value1" placeholder="请选择" @change="getManyData()">-->
<!--          <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->
      </div>
      <div class="businessSelect">
        <el-cascader
            style="width: 400px; margin-right: 10px;"
            v-model="value2"
            :options="systemOption"
            :props = 'sysProps'
            @change="handleChange"></el-cascader>
<!--        <el-select v-model="value2" placeholder="请选择" @change="getManyData()">-->
<!--          <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->
      </div>
      <div class="datePick">
        <span class="datePickTitle">时间</span>
        <el-date-picker v-model="valueDate" type="daterange" align="right" unlink-panels range-separator="——"
          start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable="false" @change="getManyData()">
        </el-date-picker>
      </div>
    </div>
    <div class="home-main">
      <div class="home-main-tab">
        <span class="home-main-tab-item" :class="activeName === 'first' ? 'active' : ''" @click="changeAction('first')">工作流（{{ WorkflowTableNum }}）</span>
        <span class="home-main-tab-item" :class="activeName === 'second' ? 'active' : ''" @click="changeAction('second')">草稿箱（{{ draftsTableNum }}）</span>
      </div>
      <div class="home-table">
        <WorkflowTable v-show="activeName === 'first'" :valueDate="valueDate" :ascription="value1" :business="value2"
          @totalChange="totalChange" ref="first" @getManyData="getManyData()"></WorkflowTable>
        <draftsTable v-show="activeName === 'second'" :valueDate="valueDate" :ascription="value1" :business="value2"
          @totalChange="totalChange" ref="second" @getManyData="getManyData()"></draftsTable>
      </div>
    </div>
  </div>
</template>

<script>
  import WorkflowTable from './component/WorkflowTable.vue'
  import draftsTable from './component/draftsTable.vue'
  import {
    format
  } from '@/assets/js/unit.js'
  import {
    getDeployCount,
    getTaskCountStatistic
  } from '@/api/unit/api.js'
  import {getProjectList} from "@/api/globalConfig";
  export default {
    data() {
      return {
        sysProps:{
          label: 'name',
          value: 'code'
        },
        projectOption: [],
        systemOption: [],
        valueDate: [format(new Date(), 'yyyy-MM-1') + ' 00:00:00', format(new Date(), 'yyyy-MM-dd') + ' 23:59:59'],
        numberList: {
          executionCompleteCount: 0,
          executionInProcessCount: 0,
          executionTotalProcessCount: 0
        },
        activeName: 'first',
        value1: 'beiqijia',
        value2: '',
        WorkflowTableNum: 0,
        draftsTableNum: 0,
        deployNumber: 0,
        options1: [{
            value: 'beiqijia',
            label: '北七家人才基地'
          },
          {
            value: 'laiwu',
            label: '莱芜供热项目'
          },
          {
            value: 'xilaideng',
            label: '海口喜来登酒店'
          }
        ],
        options2: [{
          value: '',
          label: '全部业务'
        }]
      }
    },
    methods: {
      handleChange() {
        this.getManyData()
      },
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
        this.getManyData()
        this.systemOption =  this.projectOption.filter(({ id }) => id === val)[0].children
        this.deleteEmptyChildren(this.systemOption)
        console.log(this.systemOption)
        // this.systemValue = this.systemOption[0]?.id  ??  ''
      },
      async getProjectList(){
        let res = await  getProjectList({
          count: -1,
          projectCode: '',
          tenantId:  this.$store.state.tenantId,
          type: ''
        })
        this.projectOption = res?.result ?? []
        this.value1 = this.projectOption[0].code
        this.systemOption = this.projectOption[0].children
        this.deleteEmptyChildren(this.systemOption)
        this.value2 =  this.systemOption[0].code
      },
      goBpmn() {
        this.$router.push('/home/bpmn')
      },
      totalChange(value, key) {
        this[key] = value
      },
      changeAction(value) {
        this.activeName = value
        this.$refs[value].getTableData()
      },
      getDeployCountList() {
        getDeployCount({
          ascription: this.value1,
          business: this.value2.at(-1),
          startTime: this.valueDate[0],
          endTime: this.valueDate[1],
          status: 'activation',
          tenantId: this.$store.state.tenantId
        }).then((res) => {
          this.deployNumber = res.result
        })
      },
      getManyData() {
        this.getDataNumber()
        this.getDeployCountList()
        this.$nextTick(() => {
          this.$refs.first.getTableData()
          this.$refs.second.getTableData()
        })
      },
      getDataNumber() {
        getTaskCountStatistic({
          ascription: this.value1,
          assignee: this.$store.state.userInfo.name,
          business: this.value2.at(-1),
          endTime: this.valueDate[1],
          startTime: this.valueDate[0],
          tenantId: this.$store.state.tenantId
        }).then((res) => {
          if (res) {
            this.numberList = res.result
          } else {
            this.numberList = {
              executionCompleteCount: 0,
              executionInProcessCount: 0,
              executionTotalProcessCount: 0
            }
          }
        })
      }
    },
    components: {
      WorkflowTable,
      draftsTable
    },
    mounted() {
      this.getDeployCountList()
      this.getDataNumber()
      this.getProjectList()
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
  .home-filter /deep/ .el-cascader .el-input__inner {
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
