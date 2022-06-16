<template>
  <div class="PublicForm">
    <div class="projectHeader">
      <el-select style="width: 220px" v-model="projectCode">
        <el-option v-for="{id, label, value} in rootOrganizations"
                   :key="id"
                   :label="label"
                   :value="value"></el-option>
      </el-select>
      <div class="PublicForm-title">
      </div>
      <div class="datePick">

        <el-cascader v-model="projectValue"
                     :key="projectCode"
                     :options="rootOrganizationChildrenAndAll(projectCode)"
                     :props='cascaderProps'></el-cascader>
        <span class="datePickTitle">创建时间</span>
        <el-date-picker v-model="valueDate" type="daterange" align="right" unlink-panels range-separator="——"
          start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable="false">
        </el-date-picker>
      </div>
      <div class="PublicForm-title-input">
        <el-input v-model="input" placeholder="请输入表单名称或编号"></el-input>
      </div>

      <div class="PublicForm-title-input">
        <el-button type="primary" @click="getManyData()">查询</el-button>
      </div>
      <div class="PublicForm-title-input">
        <el-button @click="reset()" type="primary">重置</el-button>
      </div>
      <div class="PublicForm-title-button">
        <el-button type="primary" @click="application()" v-role="{ id: 'FromUse', type: 'button', business: projectCode }">关联表单</el-button>
      </div>
      <div class="PublicForm-title-button">
        <el-button type="primary" @click="addForm()" v-role="{ id: 'FromAdd', type: 'button', business: projectCode }">新建表单</el-button>
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
              <span class="detailWord" @click="detailsDiolog(item)" v-role="{ id: 'FromLook', type: 'button', business: projectCode }">详情</span>
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
              <div class="card-main-item">
                <span class="label">发布次数:</span>
                <span class="value">{{ item.count }}</span>
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
                <span class="value">{{ item.createBy }}</span>
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
    <projectFormDiolog ref="projectFormDiolog" @addSuccess="addSuccess()" :dataType="dataType" :projectOption="projectOption" :systemOption="systemOption" :sysProps="sysProps"></projectFormDiolog>
    <detailsDiologForm ref="detailsDiolog" :formDatas="formData" @editForm="editForm" quote="delete" :status="activeName" @deleteSuccsee="deleteSuccsee()"></detailsDiologForm>
    <application ref="application" :dialogVisible="dialogVisible" :projectCode="projectCode" :projectValue="projectValue" @close="close()"></application>
  </div>
</template>

<script>
  import {
    format
  } from '@/assets/js/unit.js'
  import projectFormDiolog from './projectFormComponent/index.vue'
  import detailsDiologForm from './details.vue'
  import application from './projectFormComponent/application.vue'
  import { postFormDesignRecordDraftInfo, postFormDesignBasicFormRecord, postFormDesignRecordFormDesignRecordInfo } from '@/api/unit/api.js'
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'
  import {getProjectList} from "@/api/globalConfig";
  import router from "@/router";
  export default {
    data() {
      return {
        sysProps:{
          label: 'name',
          value: 'code',
          checkStrictly: true,
          emitPath: false,
        },
        systemOption: [],
        formData: {},
        projectValue: '',
        projectOption: [],
        dataType: 'enabled',
        projectCode: '',
        valueDate: [format(new Date(), 'yyyy-MM-1'), format(new Date(), 'yyyy-MM-dd')],
        input: '',
        activeName: 'enabled',
        formListFirst: [],
        formListSecond: [],
        getDataFirst: {
          page: 1,
          limit: 9999999,
          total: 0
        },
        getDataSecond: {
          page: 1,
          limit: 9999999,
          total: 0
        },
        dialogVisible: false
      }
    },
    computed:{
      ...mapState('account', ['tenantId', 'userInfo', 'currentOrganization']),
      ...mapState('uiConfig', ['cascaderProps']),
      ...mapGetters('config', [
        'rootOrganizations',
        'rootOrganizationChildrenAndAll',
      ]),
    },
    watch: {
      projectCode(value) {
        if (value === this.currentOrganization) {
          return
        }
        this.updateCurrentOrganization({ currentOrganization: value })
      },
      currentOrganization: {
        immediate: true,
        handler(value) {
          this.projectCode = value
        },
      },
    },
    methods: {
      ...mapActions('config', ['dispatchRefreshOrganization']),
      ...mapMutations('account', ['updateCurrentOrganization']),
     async init() {
          await this.dispatchRefreshOrganization()
          await  this.getDraftData()
          await  this.getEnableData()
         await this.getProjectList()
      },
      reset() {
         this.input = ''
          this.projectValue = ''
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
     async getProjectList() {
        let _this = this
         getProjectList({
            count: -1,
            projectCode: '',
            tenantId: this.tenantId,
            type: '',
           menuRoute: router.currentRoute.name,
           account: JSON.parse(sessionStorage.getItem('loginData')).account
        }).then(res=> {
          _this.projectOption = res?.result ?? []
          _this.ascriptionName = _this.projectOption[0].name
          _this.systemOption = _this.projectOption[0].children
          _this.deleteEmptyChildren(_this.systemOption)
          _this.$nextTick(() => {
            _this.$refs.projectFormDiolog.options = _this.systemOption
            _this.$refs.projectFormDiolog.postData.business = _this.projectValue
          })
        })
      },

      handleChange() {
        this.getManyData()
      },
      projectChange(val) {
        this.systemOption =  this.projectOption.filter(({ code }) => code === val)[0].children
        this.deleteEmptyChildren(this.systemOption)
        this.projectValue = this.systemOption[0]?.code  ??  ''
        this.$refs.projectFormDiolog.postData.business = this.projectValue
      },
      application() {
        this.dialogVisible = true
      },
      close() {
        this.dialogVisible = false
      },
      // 查询草稿箱
      getDraftData() {
        postFormDesignRecordDraftInfo({
          tenantId: this.tenantId,
          status: 'drafted',
          ascription: this.projectCode,
          business: typeof this.projectValue === "string"? this.projectValue: this.projectValue.at(-1),
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
      // 查询可部署流程
      getEnableData() {
        postFormDesignBasicFormRecord({
          tenantId: this.tenantId,
          status: 'enabled',
          ascription: this.projectCode,
          business: typeof this.projectValue === "string"? this.projectValue: this.projectValue.at(-1),
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
      
      deleteSuccsee() {
        this.$refs.detailsDiolog.dialogVisible2 = false
        this.getData()
      },
      
      addSuccess() {
        this.$refs.detailsDiolog.dialogVisible2 = false
        this.$refs.projectFormDiolog.dialogVisible2 = false
        this.getData()
      },
      
      changProjectCode(code) {
        this.projectCode = code
        this.getManyData()
      },
      addForm() {
        this.$refs.projectFormDiolog.dialogVisible1 = true
        this.$refs.projectFormDiolog.postData = {
          ascriptionName: '',
          ascName: '',
          ascription: '',
          business: '',
          energy: '',
          name: ''
        }
        this.$refs.projectFormDiolog.postData.ascription = this.projectCode
        this.$refs.projectFormDiolog.postData.ascriptionName = this.ascriptionName
      },
      
      addForm2(item) {
        let content = JSON.parse(item.content)
        this.$refs.projectFormDiolog.dialogVisible2 = true
        this.$nextTick(() => {
          this.$refs.projectFormDiolog.$refs.formDesigner.designList =  content.list
          this.$refs.projectFormDiolog.$refs.formDesigner.formConfig = content.config
          this.$refs.projectFormDiolog.postData = {
            ...item,
            ascriptionName: '',
            ascName:  item.business,
          }
        })
      },
      detailsDiolog(item) {
        let _this = this
          this.$refs.detailsDiolog.dialogVisible2 = true
          postFormDesignRecordFormDesignRecordInfo({
            id: item.id,
            status: this.activeName,
            tenantId: this.tenantId,
            ascription: this.projectCode,
            business: typeof this.projectValue === "string"? this.projectValue: this.projectValue.at(-1),
            createBy: this.userInfo.account
          }).then((res) => {
            this.$refs.detailsDiolog.previewVisible = true
            // this.$nextTick(() => {
            this.formData = res.result
            let arr = []
            res.result.versions.forEach((item,index) => {
              arr.push({
                value: res.result.childIds[index],
                label: item
              })
            })
            _this.$refs.detailsDiolog.options = arr
            _this.$refs.detailsDiolog.value = res.result.childIds[0]
            _this.$refs.detailsDiolog.getAllBusinessConfig(res.result)
          })

        // })
      },
      editForm(item) {
        this.addForm2(item)
      }
    },
     mounted() {
       this.init()

    },
    components:{
      projectFormDiolog,
      detailsDiologForm,
      application
    }
  }
</script>

<style scoped="scoped">
  /deep/  .el-input__inner {
    border: 1px solid black;
  }

  .PublicForm-title {}

  .checkPro {
    border: 1px solid #0066cc !important;
  }

  .projectList {
    padding: 0px 0px 20px 0px;
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 20px;
  }

  .projectList-item {
    position: relative;
    font-size: 18px;
    width: 260px;
    height: 100px;
    line-height: 100px;
    display: inline-block;
    border: 1px solid #cccccc;
    margin-right: 20px;
    padding: 0px 20px;
  }

  .projectList-item-word {
    vertical-align: super;
    display: inline-block;
    margin-left: 15px;
  }

  .item-icon {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .projectHeader {
    display: inline-block;
    margin: 0px 0px 20px 0px;
  }

  .datePick {
    display: inline-block;
    margin-top: 15px ;
  }

  .datePickTitle {
    display: inline-block;
    font-size: 14px;
    margin-right: 20px;
    margin-left: 20px;
  }

  .PublicForm-title-option {
    display: inline-block;
    margin-right: 40px;
  }

  .PublicForm-title-input {
    display: inline-block;
    margin-left: 40px;
  }

  .PublicForm-title-button {
    display: inline-block;
    margin-left: 40px;
    float: right;
    margin-top: 15px;
  }

  .home-main {
    margin-top: 20px;
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
