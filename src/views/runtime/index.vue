<template>
  <div class="runtime">
    <div class="runtime-filter">
      <div class="projectSelect marginRight20">
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in $store.state.optionsAscription" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="businessSelect marginRight20">
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in this.$store.state.optionsBusiness" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="marginRight20">
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="datePick">
        <span class="datePickTitle">时间</span>
        <el-date-picker v-model="valueDate" type="daterange" align="right" unlink-panels range-separator="——"
          start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable="false" @change="getManyData()">
        </el-date-picker>
      </div>
    </div>
    <div class="runtime-home">
      <div class="runtime-home-title">
        <div class="data">
          <div class="title">
            <b class="value">142</b>
          </div>
          <div class="titLabel">执行工作流总数</div>
        </div>
        <div class="data">
          <div class="title">
            <b class="value">142</b>
          </div>
          <div class="titLabel">执行中</div>
        </div>
        <div class="data">
          <div class="title">
            <b class="value">142</b>
          </div>
          <div class="titLabel">待执行数量</div>
        </div>
      </div>
      <div class="runtime-home-button">
        <div class="button1" @click="goAdd()">
          <div class="title">
            <i class="el-icon-circle-plus"></i>
          </div>
          <div class="titLabel">新建执行</div>
        </div>
      </div>
    </div>
    <div class="runtime-check">
      <el-radio-group v-model="radio">
          <el-radio :label="3">
            我的任务（21）
          </el-radio>
          <el-radio :label="6">
            待处理（21）
          </el-radio>
          <el-radio :label="9">
            告知（31）
          </el-radio>
        </el-radio-group>
    </div>
    <div class="runtime-table">
      <div class="home-table-main">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" label="序号" width="180" align="center">
          </el-table-column>
          <el-table-column prop="name" label="名称" width="180" align="center">
          </el-table-column>
          <el-table-column prop="name" label="能源系统" align="center">
          </el-table-column>
          <el-table-column prop="name" label="执行厂站" align="center">
          </el-table-column>
          <el-table-column prop="name" label="发起人" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createBy == -1 ? '系统' : scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="执行进程" align="center">
            <template slot-scope="scope">
              <el-steps :active="scope.row.curStep" align-center process-status="success">
                  <el-step title="步骤 1" icon="el-icon-edit" :class="scope.row.curStep === 1 ? 'tableStepNum' : ''"></el-step>
                  <el-step title="步骤 2" icon="el-icon-upload" :class="scope.row.curStep === 2 ? 'tableStepNum' : ''"></el-step>
                  <el-step title="步骤 3" icon="el-icon-picture" :class="scope.row.curStep === 3 ? 'tableStepNum' : ''"></el-step>
              </el-steps>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deployDiolog(scope.row)" type="text" size="small">
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
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="getData.page"
          :page-size="getData.limit" layout="prev, pager, next, jumper" :total="getData.total">
        </el-pagination>
      </div>
    </div>
    <runtimeAdd :dialogVisible="dialogVisibleAdd" @close="closeDialogAdd"></runtimeAdd>
    <runTimeImplement :dialogVisible="dialogVisibleImplement" @close="closeDialogImplement"></runTimeImplement>
  </div>
</template>

<script>
  import runtimeAdd from './component/runtimeAdd.vue'
  import runTimeImplement from './component/runTimeImplement.vue'
  export default {
    data() {
      return {
        options: [],
        value: '',
        valueDate: [],
        radio: '',
        checkList: [],
        dialogVisibleAdd: false,
        dialogVisibleImplement: false,
        tableData: [
          {
            name: '王小虎',
            curStep: 2
          },
          {
            name: '王小虎',
            curStep: 1
          },
          {
            name: '王小虎',
            curStep: 3
          },
          {
            name: '王小虎',
            curStep: 0
          }
        ],
        getData: {
          page: 1,
          limit: 10,
          total: 100
        }
      }
    },
    methods: {
      getManyData() {

      },
      handleSizeChange() {

      },
      handleCurrentChange() {

      },
      deployDiolog() {
        this.dialogVisibleImplement = true
      },
      closeDialogImplement() {
        this.dialogVisibleImplement = false
      },
      detailsDiolog() {
        
      },
      goAdd() {
        this.dialogVisibleAdd = true
      },
      closeDialogAdd() {
        this.dialogVisibleAdd = false
      }
    },
    components:{
      runtimeAdd,
      runTimeImplement
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
      .tableStepNum {
        .el-step__icon {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: #0066cc !important;
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
        color: white !important;
        font-size: 12px;
      }
    }
  }
</style>
