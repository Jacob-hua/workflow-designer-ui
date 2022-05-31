<template>
  <div class="runtime">
    <div class="runtime-filter">
      <div class="projectSelect marginRight20">
        <el-select v-model="getData.projectCode" placeholder="请选择" @change="getAllApi()">
          <el-option v-for="item in $store.state.optionsAscription" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="businessSelect marginRight20">
        <el-select v-model="getData.businessCode" placeholder="请选择" @change="getAllApi()">
          <el-option v-for="item in this.$store.state.optionsBusiness" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <!-- <div class="marginRight20">
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div> -->
      <div class="datePick">
        <span class="datePickTitle">时间</span>
        <el-date-picker v-model="valueDate" type="daterange" align="right" unlink-panels range-separator="——"
          start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable="false" @change="getAllApi()">
        </el-date-picker>
      </div>
    </div>
    <div class="runtime-home">
      <div class="runtime-home-title">
        <div class="data">
          <div class="title">
            <b class="value">{{ numberList.executionTotalProcessCount }}</b>
          </div>
          <div class="titLabel">执行工作流总数</div>
        </div>
        <div class="data">
          <div class="title">
            <b class="value">{{ numberList.executionInProcessCount }}</b>
          </div>
          <div class="titLabel">执行中</div>
        </div>
        <div class="data">
          <div class="title">
            <b class="value">{{ numberList.executionCompleteCount }}</b>
          </div>
          <div class="titLabel">已完成数量</div>
        </div>
      </div>
      <div class="runtime-home-button">
        <div class="button1" @click="goAdd()">
          <div class="title">
            <i class="el-icon-circle-plus"></i>
          </div>
          <div class="titLabel">创建工单</div>
        </div>
      </div>
    </div>
    <div class="runtime-check">
      <el-radio-group v-model="getData.taskFilter" @change="changeGroup()">
        <el-radio label="all">
          我的任务（{{ Amount.all }}）
        </el-radio>
        <el-radio label="self">
          待处理（{{ Amount.self }}）
        </el-radio>
        <el-radio label="notice">
          告知（{{ Amount.notice }}）
        </el-radio>
      </el-radio-group>
    </div>
    <div class="runtime-table">
      <div class="home-table-main">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" label="序号" align="center">
          </el-table-column>
          <el-table-column prop="processName" label="名称" align="center" show-overflow-tooltip="">
          </el-table-column>
          <el-table-column prop="energyType" label="能源系统" align="center">
          </el-table-column>
          <el-table-column prop="name" label="执行厂站" align="center">
          </el-table-column>
          <el-table-column prop="starter" label="发起人" align="center">
            <!-- <template slot-scope="scope">
              <span>{{ scope.row.processStarter == -1 ? '系统' : scope.row.processStarter }}</span>
            </template> -->
          </el-table-column>
          <el-table-column prop="startTime" label="发起时间" align="center">
          </el-table-column>
          <el-table-column label="执行进程" align="center" min-width="250">
            <template slot-scope="scope">
              <el-steps :active="scope.row.trackList.length" align-center process-status="success">
                <el-step :title="item.taskName" :description="statusObj[item.status]" icon="el-icon-edit" :class="statusClassObj[item.status]"
                  v-for="(item, index) in scope.row.trackList" :key="index"></el-step>
              </el-steps>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deployDiolog(scope.row)" type="text" size="small" v-if="showDeployDiologButton(scope.row)">
                执行
              </el-button>
              <el-button @click.native.prevent="detailsDiolog(scope.row)" type="text" size="small">
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="home-table-page">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="getData.page"
          :page-size.sync="getData.limit" layout="prev, pager, next, jumper" :total="getData.total">
        </el-pagination>
      </div>
    </div>
    <runtimeAdd :dialogVisible="dialogVisibleAdd" @close="closeDialogAdd" @succseeAdd="succseeAdd()"></runtimeAdd>
    <runTimeImplement :dialogVisible="dialogVisibleImplement" @close="closeDialogImplement" @goSee="detailsDiolog" ref="runTimeImplement"
      @taskSuccess="taskSuccess()"></runTimeImplement>
    <lookover ref="lookover" @goReject="deployDiolog"></lookover>
  </div>
</template>

<script>
  import bpmnData from "@/assets/js/bpmnMock.js"
  import runtimeAdd from './component/runtimeAdd.vue'
  import runTimeImplement from './component/runTimeImplement.vue'
  import lookover from './component/lookover.vue'
  import {
    getTaskList,
    getTaskCountStatistic,
    getNewTaskList,
    postTaskCountStatistics
  } from '@/unit/api.js'
  import {
    format
  } from '@/assets/js/unit.js'
  export default {
    data() {
      return {
        numberList: {
          executionCount: 0,
          completeCount: 0,
          executionInCount: 0
        },
        Amount: {
          all: 0,
          notice: 0,
          self: 0
        },
        options: [],
        value: '',
        valueDate: [format(new Date(), 'yyyy-MM-1') + ' 00:00:00', format(new Date(), 'yyyy-MM-dd') + ' 23:59:59'],
        checkList: [],
        dialogVisibleAdd: false,
        dialogVisibleImplement: false,
        tableData: [],
        statusObj: {
          completed: '通过',
          run: '执行',
          deleted: '删除',
          hang: '挂起',
          '-': '执行',
          rejected: '驳回'
        },
        statusClassObj: {
          completed: '',
          '-': 'tableStepOnly',
          deleted: 'tableStepDeleted',
          hang: 'tableStepHang',
          rejected: 'tableStepDeleted'
        },
        getData: {
          assignee: this.$store.state.userInfo.name,
          businessCode: '',
          endTime: '',
          order: 'desc',
          projectCode: '',
          startTime: '',
          taskFilter: 'all',
          tenantId: this.$store.state.tenantId,
          page: 1,
          limit: 10,
          total: 1
        }
      }
    },
    methods: {
      changeGroup() {
        this.getData.page = 1
        this.getData.limit = 10
        this.getManyData()
      },
      getManyData() {
        this.getData.startTime = this.valueDate[0]
        this.getData.endTime = this.valueDate[1]
        this.getData.businessCode = this.getData.businessCode
        this.getData.projectCode = this.getData.projectCode
        getNewTaskList(this.getData).then((res) => {
         if (res) {
           this.tableData = res.result.dataList
           this.tableData.forEach((item) => {
             if (item.taskAssignee.split(',').indexOf(this.$store.state.userInfo.name) !== -1) {
               item.newTaskId = item.taskId.split(',')[item.taskAssignee.split(',').indexOf(this.$store.state.userInfo.name)]
             } else{
               item.trackList[item.trackList.length - 1].candidateUsers.forEach((item1) => {
                 if (item1.candidateUsers.indexOf(this.$store.state.userInfo.name) !== -1) {
                   console.log('xx')
                   item.newTaskId = item1.taskId
                 }
               })
             }
             
           })
           this.getData.total = res.result.count * 1
         } else {
           this.tableData = []
         } 
        })
      },
      getAmount() {
        let obj = {
          assignee: this.$store.state.userInfo.name,
          businessCode: this.getData.businessCode,
          startTime: this.valueDate[0],
          endTime: this.valueDate[1],
          projectCode: this.getData.projectCode,
          tenantId: this.$store.state.tenantId
        }
        postTaskCountStatistics(obj).then((res) => {
          this.Amount = res.result
        })
      },
      
      showDeployDiologButton(row) {
        let rolePeopleList = []
        row.trackList[row.trackList.length - 1].candidateUsers.forEach((item) => {
          item.candidateUsers.forEach((item1) => {
            rolePeopleList.push(item1)
          })
        })
        return rolePeopleList.concat(row.taskAssignee.split(',')).indexOf(this.$store.state.userInfo.name) !== -1
      },
      
      handleSizeChange() {
        this.getManyData()
      },
      handleCurrentChange() {
        this.getManyData()
      },
      deployDiolog(row) {
        this.dialogVisibleImplement = true
        this.$nextTick(() => {
          this.$refs.runTimeImplement.getNachList(row.trackList)
          this.$refs.runTimeImplement.$refs.ProcessInformation.createNewDiagram(row.content, row.taskKey)
          this.$refs.runTimeImplement.$refs.ProcessInformation.postData = row
          this.$refs.runTimeImplement.$refs.ProcessInformation.postData.deployName = row.processName
          this.$refs.runTimeImplement.$refs.ProcessInformation.postData.version = row.starter
          this.$refs.runTimeImplement.$refs.ProcessInformation.postData.createTime = row.startTime
          this.$refs.runTimeImplement.$refs.ProcessInformation.postData.systemType = row.energyType
          this.$refs.runTimeImplement.dataList.Hang = row.taskStatus.split(',').indexOf('hang') == '-1'
          if (!this.$refs.runTimeImplement.dataList.Hang) {
            this.$refs.runTimeImplement.functionCheck = 'Hang'
          }
        })
      },
      // deployDiolog(row) {
      //   this.dialogVisibleImplement = true
      //   this.$nextTick(() => {
      //     this.$refs.runTimeImplement.getNachList(row.processInstanceId).then(() => {
      //       this.$refs.runTimeImplement.$refs.ProcessInformation.createNewDiagram(row.content, row.taskKey)
      //     })
      //     this.$refs.runTimeImplement.$refs.ProcessInformation.postData = row
      //     this.$refs.runTimeImplement.$refs.ProcessInformation.postData.version = row.processStarter
      //     this.$refs.runTimeImplement.$refs.ProcessInformation.postData.deployName = row.processName
      //     this.$refs.runTimeImplement.dataList.Hang = row.status !== 'hang'
      //     if (!this.$refs.runTimeImplement.dataList.Hang) {
      //       this.$refs.runTimeImplement.functionCheck = 'Hang'
      //     }
      //   })
      // },
      closeDialogImplement() {
        this.dialogVisibleImplement = false
      },
      succseeAdd() {
        this.dialogVisibleAdd = false
        this.getManyData()
      },
      detailsDiolog(row) {
        this.$refs.lookover.dialogVisible = true
        this.$nextTick(() => {
          this.$refs.lookover.$refs.ProcessInformation.postData = row
          this.$refs.lookover.$refs.ProcessInformation.postData.deployName = row.processName
          this.$refs.lookover.$refs.ProcessInformation.postData.version = row.starter
          this.$refs.lookover.$refs.ProcessInformation.postData.createTime = row.startTime
          this.$refs.lookover.$refs.ProcessInformation.postData.systemType = row.energyType
          this.$refs.lookover.getListData(row.trackList)
          this.$refs.lookover.$refs.ProcessInformation.createNewDiagram(row.content, row.taskKey)
        })
      },
      // detailsDiolog(row) {
      //   this.$refs.lookover.dialogVisible = true
      //   this.$nextTick(() => {
      //     this.$refs.lookover.$refs.ProcessInformation.postData = row
      //     this.$refs.lookover.$refs.ProcessInformation.postData.version = row.processStarter
      //     this.$refs.lookover.$refs.ProcessInformation.postData.deployName = row.processName
      //     this.$refs.lookover.getListData(row.processInstanceId).then(() => {
      //       this.$refs.lookover.$refs.ProcessInformation.createNewDiagram(row.content, row.taskKey)
      //     })
      //   })
      // },
      goAdd() {
        this.dialogVisibleAdd = true
      },
      closeDialogAdd() {
        this.dialogVisibleAdd = false
      },
      taskSuccess() {
        this.dialogVisibleImplement = false
        this.getManyData()
      },
      getAllApi() {
        this.getDataNumber()
        this.getManyData()
        this.getAmount()
      },
      getDataNumber() {
        getTaskCountStatistic({
          ascription: this.getData.projectCode,
          assignee: this.$store.state.userInfo.name,
          business: this.getData.businessCode,
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
    created() {
      this.getManyData()
      this.getAmount()
      this.getDataNumber()
    },
    mounted() {
      // this.getDataNumber()
    },
    components: {
      runtimeAdd,
      runTimeImplement,
      lookover
    }
  }
</script>

<style scoped="scoped" lang="scss">
  .runtime {
    margin: 20px;
  }

  .runtime-filter {
    display: flex;
  }

  .runtime-filter /deep/ .el-select .el-input__inner {
    border: 1px solid #000;
    height: 50px;
    line-height: 50px;
    width: 320px;
    font-size: 16px;
    color: #000000;
  }

  .marginRight20 {
    margin-right: 20px;
  }

  .button1 {
    cursor: pointer;
  }

  .datePick {}

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

  .runtime-home {
    margin-top: 40px;
    display: flex;
  }

  .runtime-home-title {
    width: 1286px;
    height: 142px;
    background-color: #f2f2f2;
    display: flex;
  }

  .runtime-home-title .data {
    flex: 1;
    text-align: center;
  }

  .runtime-home-title .data .title {
    font-size: 36px;
    height: 100px;
    line-height: 100px;
  }

  .runtime-home-button {
    width: 368px;
    height: 142px;
    background-color: #f2f2f2;
    margin-left: 20px;
    display: flex;
  }

  .runtime-home-button>div {
    flex: 1;
    text-align: center;
    padding: 20px 0px;
  }

  .runtime-home-button .title {
    font-size: 36px;
    height: 80px;
    line-height: 80px;
  }

  .titLabel {
    font-size: 14px;
  }

  .runtime-check {
    margin-top: 40px;
  }

  .runtime-table {
    padding: 10px;
    border: 1px solid #666666;
    margin-top: 20px;
  }

  .runtime-table .home-table-page {
    text-align: right;
    padding: 20px 0px;
  }

  /deep/ .el-table {
    .el-steps {
      position: relative;
      line-height: 23px;
      top: 0px;

      .tableStepOnly {
        .el-step__icon {
          background-color: #0066cc !important;
        }
      }

      .tableStepDeleted {
        .el-step__icon {
          background-color: red !important;
        }
      }
      .tableStepHang {
        .el-step__icon {
          background-color: green !important;
        }
      }

      .el-step__head.is-finish {
        .el-step__icon {
          background-color: #66ccff;
        }

        .el-step__line {
          height: 2px;
          border-color: #66ccff;
        }
      }

      .el-step__head {
        margin-top: 20px;
      }

      .el-step__icon-inner {
        display: none;
      }

      .el-step__line {
        height: 2px;
      }

      .el-step__icon {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #CCCCCC;
      }

      .el-step__line-inner {
        border-width: 1px !important;
        margin-top: 0px;
      }

      .el-step__title {
        color: #858585 !important;
        font-size: 12px;
      }

      .el-step__description {
        // color: white ;
        font-size: 12px;
        position: absolute;
        top: 5px;
        width: 100%;
      }
    }
  }
</style>
