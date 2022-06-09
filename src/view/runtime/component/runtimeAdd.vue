<template>
  <div>
    <el-dialog title="新建执行"
               width="66%"
               :visible="dialogVisible"
               :before-close="handleClose"
               @open="openDialog">
      <div class="diolog-main">
        <div class="diolog-main-left">
          <div class="energy-list">
            <div v-for="({label, value}, index) in optionsSystemType"
                 class="energy-list-item"
                 :class="energyListItemClass(value)"
                 :key="index"
                 @click="changEnergy(value)"> {{ label }}系统 </div>
          </div>
        </div>
        <div class="diolog-main-right">
          <div class="process-list">
            <div class="process-list-item"
                 v-for="(process, index) in processList"
                 :key="index">
              <div class="process-list-item-detail"
                   @click="detailsShow(process)">
                <span>详情</span>
              </div>
              <div class="process-list-item-word">
                <label>部署名称:</label>
                <span>{{ process.deployName }}</span>
              </div>
              <div class="process-list-item-word">
                <label>部署人:</label>
                <span>{{ process.user }}</span>
              </div>
              <div class="process-list-item-word">
                <label>部署时间:</label>
                <span>{{ process.createTime }}</span>
              </div>
              <div class="process-list-item-button">
                <el-button type="primary"
                           plain
                           @click="open(process)">创建</el-button>
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
    <detailsRem ref="detailsRem"
                seeType="runTime"></detailsRem>
  </div>
</template>

<script>
import detailsRem from '@/view/home/component/details.vue'
import { getProcessDefinitionList, getStartProcess } from '@/api/unit/api.js'
import { mapState } from 'vuex'

export default {
  name: 'RuntimeAdd',
  components: {
    detailsRem,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      input: '',
      processList: [],
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
  computed: {
    ...mapState(['optionsSystemType']),
  },
  methods: {
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
    open(item) {
      this.$confirm('创建的执行会进入执行列表并开始执行流程,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          getStartProcess({
            businessKey: '',
            definitionKey: item.key,
            createBy: this.$store.state.userInfo.name,
            startProcessId: item.id,
            variables: {},
          }).then((res) => {
            this.$message({
              type: 'success',
              message: '创建成功',
            })
            this.$emit('succseeAdd')
          })
        })
        .catch(() => {})
    },
    changEnergy(value) {
      this.getData.type = value
      this.getProcessList()
    },
    openDialog() {
      this.getProcessList()
    },
    detailsShow(item) {
      this.$refs.detailsRem.dialogVisible2 = true
      this.$nextTick(() => {
        this.$refs.detailsRem.$refs.details2.postData = item
        this.$refs.detailsRem.$refs.details2.postData.version = item.user
        this.$refs.detailsRem.$refs.details2.createNewDiagram(item.content)
      })
    },
  },
}
</script>

<style scoped>
.diolog-main {
  display: flex;
}

.diolog-main-left {
  flex: 2;
  background-color: #f3f3f3;
  text-align: center;
  height: 695px;
}

.diolog-main-right {
  flex: 8;
  background-color: #f3f3f3;
  margin-left: 20px;
  height: 695px;
  padding: 0px 20px;
}

.diolog-main-left ::v-deep .el-input {
  width: 220px;
}

.diolog-main-left ::v-deep .el-input .el-input__inner {
  border-radius: 20px;
}

.energy-list {
  margin-top: 30px;
}

.energy-list-item {
  width: 220px;
  height: 44px;
  line-height: 44px;
  border: 1px solid #000000;
  margin: 0 auto;
  cursor: pointer;
}

.check-pro {
  border-color: #0066cc;
  color: #0066cc;
}

.process-list {
  height: 624px;
}

.process-list-item {
  width: 290px;
  height: 178px;
  background-color: #e4e4e4;
  padding: 20px 0px 0px 20px;
  position: relative;
  margin-right: 20px;
  display: inline-block;
  margin-top: 30px;
}

.process-list-item-detail {
  position: absolute;
  right: 20px;
  top: 10px;
  color: #1890ff;
  cursor: pointer;
}

.process-list-item-word {
  font-size: 14px;
  color: #000000;
  margin-bottom: 20px;
}

.process-list-item-button {
  text-align: center;
}

.process-list-item-button ::v-deep .el-button {
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
