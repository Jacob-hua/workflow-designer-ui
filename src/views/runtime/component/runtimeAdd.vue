<template>
  <div>
    <el-dialog title="新建执行" :visible="dialogVisible" width="66%" :before-close="handleClose">
      <div class="diologMain">
        <div class="diologMain-left">
          <el-input v-model="input" placeholder="请输入内容" prefix-icon="el-icon-search"></el-input>
          <div class="energyList">
            <div v-for="(item, index) in $store.state.optionsSystemType" class="energyList-item" :class="getData.systemType === item.value ? 'checkPro' : ''"
              @click="changEnergy(item.value)"> {{ item.label }}系统 </div>
          </div>
        </div>
        <div class="diologMain-right">
          <div class="processList">
            <div class="processList-item" v-for="(item, index) in processListList" :key="index">
              <div class="processList-item-detail" @click="detailsShow()">
                <span>详情</span>
              </div>
              <div class="processList-item-word">
                <label>部署名称:</label>
                <span>一般性周期巡视</span>
              </div>
              <div class="processList-item-word">
                <label>部署人:</label>
                <span>张三</span>
              </div>
              <div class="processList-item-word">
                <label>部署时间:</label>
                <span>2021-11-12 14:11:23</span>
              </div>
              <div class="processList-item-button">
                <el-button type="primary" plain @click="open">创建</el-button>
              </div>
            </div>
          </div>
          <div class="process-page">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="getData.page"
              :page-size="getData.limit" layout="prev, pager, next, jumper" :total="getData.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-dialog>
    <detailsRem ref="detailsRem" seeType="see"></detailsRem>
  </div>
</template>

<script>
  import detailsRem from '@/views/home/component/details.vue'
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        input: '',
        processListList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        getData: {
          systemType: 'energy-1',
          page: 1,
          limit: 10,
          total: 1
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit('close')
      },
      handleSizeChange() {

      },
      handleCurrentChange() {

      },
      open() {
        this.$prompt('请输入流程密钥', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({
          value
        }) => {
          this.$message({
            type: 'success',
            message: '创建成功'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消创建'
          });
        });
      },
      changEnergy(value) {
        this.getData.systemType = value
      },
      detailsShow() {
        this.$refs.detailsRem.dialogVisible2 = true
      }
    },
    components: {
      detailsRem
    }
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
