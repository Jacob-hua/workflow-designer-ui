<template>
  <div class="PublicForm">
    <div class="PublicForm-title">
      <div class="datePick">
        <span class="datePickTitle">创建时间</span>
        <el-date-picker v-model="valueDate" type="daterange" align="right" unlink-panels range-separator="——"
          start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable="false">
        </el-date-picker>
      </div>
      <div class="PublicForm-title-input">
        <el-input v-model="input" placeholder="请输入内容"></el-input>
      </div>
      <div class="PublicForm-title-input">
        <el-button type="primary" @click="getManyData()">查询</el-button>
      </div>
      <div class="PublicForm-title-button">
        <el-button type="primary" @click="addForm()">新建表单</el-button>
      </div>
    </div>
    <div class="home-main">
      <div class="home-main-tab">
        <span class="home-main-tab-item" :class="activeName === 'enabled' ? 'active' : ''" @click="changeActiveName('enabled')">可用表单（{{ getDataFirst.total }}）</span>
        <span class="home-main-tab-item" :class="activeName === 'drafted' ? 'active' : ''" @click="changeActiveName('drafted')">草稿箱（{{ getDataSecond.total }}）</span>
      </div>
      <div class="home-table">
        <div v-if="activeName === 'enabled'">
          <div class="home-table-card" v-for="(item, index) in formListFirst" :key="index">
            <div class="card-title">
              <span class="title">{{ item.numberCode }}</span>
              <span class="detailWord" @click="detailsDiolog(item)">详情</span>
            </div>
            <div class="card-main">
              <div class="card-main-item">
                <span class="label">表单名称:</span>
                <span class="value" :title="item.name">{{ item.name }}</span>
              </div>
              <div class="card-main-item">
                <span class="label">创建人:</span>
                <span class="value">{{ item.createBy == -1 ? '系统' : item.createBy }}</span>
              </div>
              <div class="card-main-item">
                <span class="label">创建时间:</span>
                <span class="value">{{ item.createTime }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeName === 'drafted'">
          <div class="home-table-card" v-for="(item, index) in formListSecond" :key="index">
            <div class="card-title">
              <span class="title">{{ item.numberCode }}</span>
              <span class="detailWord" @click="detailsDiolog(item)">详情</span>
            </div>
            <div class="card-main">
              <div class="card-main-item">
                <span class="label">表单名称:</span>
                <span class="value" :title="item.name">{{ item.name }}</span>
              </div>
              <div class="card-main-item">
                <span class="label">创建人:</span>
                <span class="value">{{ item.createBy == -1 ? '系统' : item.createBy }}</span>
              </div>
              <div class="card-main-item">
                <span class="label">创建时间:</span>
                <span class="value">{{ item.createTime }}</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    <PublicFormDiolog ref="PublicFormDiolog" @addSuccess="addSuccess()" :dataType="dataType"></PublicFormDiolog>
    <detailsDiolog ref="detailsDiolog" :formDatas="formData" @editForm="editForm" :status="activeName" ascription="public"></detailsDiolog>
  </div>
</template>

<script>
  import {
    format
  } from '@/assets/js/unit.js'
  import PublicFormDiolog from './PublicFormComponent/index.vue'
  import detailsDiolog from './details.vue'
  import { postFormDesignRecordDraftInfo, postFormDesignBasicFormRecord, postFormDesignRecordFormDesignRecordInfo } from '@/api/unit/api.js'
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
        formData: {},
        valueDate: [format(new Date(), 'yyyy-MM-1'), format(new Date(), 'yyyy-MM-dd')],
        input: '',
        activeName: 'enabled',
        formListFirst: [],
        formListSecond: [],
        dataType: 'enabled',
        getDataFirst: {
          page: 1,
          limit: 9999999,
          total: 0
        },
        getDataSecond: {
          page: 1,
          limit: 9999999,
          total: 0
        }
      }
    },
    computed: {
      ...mapState('account', ['userInfo', 'tenantId'])
    },
    methods:{
      // 查询草稿箱
      getDraftData() {
        this.valueDate = this.valueDate || []
        postFormDesignRecordDraftInfo({
          tenantId: this.tenantId,
          status: 'drafted',
          ascription: 'public',
          business: '',
          createBy: this.userInfo.account,
          numberCode: '',
          name: this.input,
          startTime: this.valueDate[0] + ' 00:00:00',
          endTime: this.valueDate[1] + ' 23:59:59',
          ...this.getDataSecond
        }).then((res) => {
          this.formListSecond = res.result.dataList
          this.getDataSecond.total = res.result.count
        })
      },
      // 查询公共表单
      getEnableData() {
        this.valueDate = this.valueDate || []
        postFormDesignBasicFormRecord({
          tenantId: this.tenantId,
          status: 'enabled',
          ascription: 'public',
          business: '',
          createBy: this.userInfo.account,
          numberCode: '',
          name: this.input,
          startTime: this.valueDate[0] + ' 00:00:00',
          endTime: this.valueDate[1] + ' 23:59:59',
          ...this.getDataFirst
         }).then((res) => {
          this.formListFirst = res.result.dataList
          this.getDataFirst.total = res.result.count
        })
      },
      
      getManyData() {
        this.getEnableData()
        this.getDraftData()
      },
      
      getData() {
        switch (this.activeName){
          case 'enabled':
            this.getEnableData()
            break;
          case 'drafted':
            this.getDraftData()
            break;
          default:
            break;
        }
      },
      
      changeActiveName(value) {
        this.activeName = value
        this.getManyData()
      },
      
      addSuccess(value) {
        this.$refs.PublicFormDiolog.dialogVisible2 = false
        this.$refs.detailsDiolog.dialogVisible2 = false
        this.getManyData()
      },
      
      addForm(item) {
        if (item) {
          this.$refs.PublicFormDiolog.dialogVisible2 = true
          let content = JSON.parse(item.content)
          this.$nextTick(() => {
            this.$refs.PublicFormDiolog.$refs.formDesigner.designList =  content.list
            this.$refs.PublicFormDiolog.$refs.formDesigner.formConfig = content.config
            this.$refs.PublicFormDiolog.postData = {
              ascriptionName: '',
              ascName: item.business,
              ...item
            }
          })
        }
        this.$refs.PublicFormDiolog.dialogVisible2 = true
      },
      detailsDiolog(item) {
        this.$refs.detailsDiolog.dialogVisible2 = true
        postFormDesignRecordFormDesignRecordInfo({
          id: item.id,
          status: this.activeName,
          tenantId: this.tenantId,
          ascription: 'public',
          business: '',
          createBy: this.userInfo.account
        }).then((res) => {
          this.$refs.detailsDiolog.previewVisible = true
          this.formData = res.result
          this.$nextTick(() => {
            let arr = []
            res.result.versions.forEach((item, index) => {
              arr.push({
                value: res.result.childIds[index],
                label: item
              })
            })
            this.$refs.detailsDiolog.options = arr
            this.$refs.detailsDiolog.value = res.result.childIds[0]
            // this.$refs.detailsDiolog.$refs.formbpmn.schema = JSON.parse(res.result.content)
            // this.$refs.detailsDiolog.$refs.formbpmn.init()
          })
        })
      },
      editForm(item) {
        this.addForm(item)
      }
    },
    components:{
      PublicFormDiolog,
      detailsDiolog
    },
    created() {
      this.getEnableData()
      this.getDraftData()
    }
  }
</script>

<style scoped="scoped">
  /deep/ .el-input__inner {
    border: 1px solid black;
  }
  .PublicForm-title {
    
  }
  .datePick {
    display: inline-block;
  }
  .datePickTitle {
    display: inline-block;
    font-size: 14px;
    margin-right: 20px;
  }
  .PublicForm-title-input {
    display: inline-block;
    margin-left: 40px;
  }
  .PublicForm-title-button {
    display: inline-block;
    margin-left: 40px;
    float: right;
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
  
  .home-table {
    min-height: 786px;
    border: 1px solid #666666;
    margin-bottom: 40px;
    padding: 20px 20px;
  }
  
  .home-table-card {
    border: 1px solid #666666;
    min-height: 170px;
    display: inline-block;
    width: 334px;
    margin-right: 40px;
    margin-bottom: 40px;
  }
  .card-title {
    height: 30px;
    line-height: 30px;
    background-color: #e9e9e9;
    padding: 0px 20px;
  }
  .card-title .title {
    font-size: 14px;
  }
  .card-title .detailWord {
    float: right;
    color: #7b68cf;
    font-size: 14px;
    cursor: pointer;
  }
  .card-main {
    padding: 10px 10px;
  }
  .card-main-item {
    line-height: 40px;
    height: 40px;
    color: black;
    font-size: 14px;
  }
  .card-main-item .label {
    display: inline-block;
    width: 90px;
    vertical-align: top;
  }
  .card-main-item .value {
    width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    vertical-align: top;
  }
</style>
