<template>
  <div>
    <el-dialog title="新建执行"
               :visible="dialogVisible"
               width="66%"
               :before-close="handleClose"
               @open="openDialog">
      <div class="diologMain">
        <div class="diologMain-left">
          <!-- <el-input v-model="input" placeholder="请输入内容" prefix-icon="el-icon-search"></el-input> -->
          <div class="energyList">
            <div v-for="(item, index) in projectOption"
                 class="energyList-item"
                 :class="getData.type === item.code ? 'checkPro' : ''"
                 @click="changEnergy(item.code)"> {{ item.name }}系统 </div>
          </div>
        </div>
        <div class="diologMain-right">
          <div class="processList">
            <div class="processList-item"
                 v-for="(item, index) in processListList"
                 :key="index">
              <div class="processList-item-detail"
                   @click="detailsShow(item)">
                <span>详情</span>
              </div>
              <div class="processList-item-word">
                <label>部署名称:</label>
                <span>{{ item.deployName }}</span>
              </div>
              <div class="processList-item-word">
                <label>部署人:</label>
                <span>{{ item.user }}</span>
              </div>
              <div class="processList-item-word">
                <label> 部署时间:</label>
                <span>{{ item.createTime }}</span>
              </div>
              <div class="process-list-item-button">
                <el-button type="primary"
                           plain
                           @click="createTicket(process)">创建</el-button>
              </div>
            </div>
          </div>
          <div class="process-page">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page.sync="getData.page"
                           :page-size="getData.limit"
                           layout="prev, pager, next, jumper"
                           :total="getData.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-dialog>
    <runtime-creat-ticket :visible="createTicketVisible"
                          :process="process"
                          @close="onCreateTicketVisible" />
    <detailsRem ref="detailsRem"
                seeType="runTime"></detailsRem>
  </div>
</template>

<script>
import detailsRem from '@/view/home/component/details.vue'
import { getProcessDefinitionList } from '@/api/unit/api.js'
import { mapState } from 'vuex'
import RuntimeCreatTicket from './RuntimeCreatTicket.vue'

export default {
  name: 'RuntimeAdd',
  components: {
    detailsRem,
    RuntimeCreatTicket,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    data() {
      return {
        projectOption: [],
        input: '',
        processListList: [],
        getData: {
          type: 'energy-1',
          order: 'desc',
          page: 1,
          limit: 9,
          tenantId: this.$store.state.tenantId,
          total: 1,
        },
      }
    },

    created() {
      // this.getProcessList()
    },
    mounted() {
      this.getProjectList()
    },
    methods: {
      async getProjectList() {
        let res = await getProjectList({
          count: -1,
          projectCode: '',
          tenantId: this.$store.state.tenantId,
          type: '',
        })
        this.projectOption = res?.result ?? []
      },
      createTicketVisible: false,
      process: {},
    },
  },
  computed: {
    ...mapState(['optionsSystemType']),
  },
  methods: {
    onCreateTicketVisible() {
      this.createTicketVisible = false
    },
    energyListItemClass(value) {
      return this.getData.type === value ? 'check-pro' : ''
    },
    handleClose() {
      this.$emit('close')
    },
    getProcessList() {
      getProcessDefinitionList(this.getData).then((res) => {
        this.processList = res.result.dataList
        this.getData.total = res.result.count * 1
      })
    },
    handleSizeChange() {
      this.getProcessList()
    },
    handleCurrentChange() {
      this.getProcessList()
    },
    createTicket(process) {
      this.createTicketVisible = true
      this.process = process
      // this.$confirm('创建的执行会进入执行列表并开始执行流程,是否继续', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      // })
      //   .then(() => {
      //     getStartProcess({
      //       businessKey: '',
      //       definitionKey: process.key,
      //       createBy: this.$store.state.userInfo.name,
      //       startProcessId: process.id,
      //       variables: {},
      //     }).then(() => {
      //       this.$message({
      //         type: 'success',
      //         message: '创建成功',
      //       })
      //       this.$emit('succseeAdd')
      //     })
      //   })
      //   .catch(() => {})
    },
    components: {
      detailsRem,
    },
  },
}
</script>

<style scoped="scoped">
.diologMain {
  display: flex;
}

.diologMain-left {
  flex: 2;
  background-color: #f3f3f3;
  text-align: center;
  height: 695px;
}

.diologMain-right {
  flex: 8;
  background-color: #f3f3f3;
  margin-left: 20px;
  height: 695px;
  padding: 0px 20px;
}

.diologMain-left /deep/ .el-input {
  width: 220px;
}

.diologMain-left /deep/ .el-input .el-input__inner {
  border-radius: 20px;
}

.energyList {
  margin-top: 30px;
}

.energyList-item {
  width: 220px;
  height: 44px;
  line-height: 44px;
  border: 1px solid #000000;
  margin: 0 auto;
  cursor: pointer;
}

.checkPro {
  border-color: #0066cc;
  color: #0066cc;
}

.processList {
  height: 624px;
}

.processList-item {
  width: 290px;
  height: 178px;
  background-color: #e4e4e4;
  padding: 20px 0px 0px 20px;
  position: relative;
  margin-right: 20px;
  display: inline-block;
  margin-top: 30px;
}

.processList-item-detail {
  position: absolute;
  right: 20px;
  top: 10px;
  color: #1890ff;
  cursor: pointer;
}

.processList-item-word {
  font-size: 14px;
  color: #000000;
  margin-bottom: 20px;
}

.processList-item-button {
  text-align: center;
}

.processList-item-button /deep/ .el-button {
  height: 30px;
  line-height: 30px;
  padding: 0px 20px;
}

.process-page {
  text-align: right;
  margin-top: 20px;
  margin-right: 20px;
}
</style>
