<template>
  <div>
    <el-dialog title="应用" :visible="dialogVisible" width="70%" :before-close="handleClose">
      <div class="diologMain">
        <!-- <div class="diologMain-left">
          <el-input v-model="input" placeholder="请输入内容" prefix-icon="el-icon-search"></el-input>
          <div class="energyList">
            <div v-for="(item, index) in $store.state.optionsSystemType" class="energyList-item" :class="getData.systemType === item.value ? 'checkPro' : ''"
              @click="changEnergy(item.value)"> {{ item.label }}系统 </div>
          </div>
        </div> -->
        <div class="diologMain-right">
          <div class="processList">
            <div class="processList-item" v-for="(item, index) in formList" :key="index">
<!--              <div class="processList-item-detail" @click="detailsShow()">
                <span>详情</span>
              </div> -->
              <div class="processList-item-word">
                <label>表单名称:</label>
                <span>{{ item.name }}</span>
              </div>
              <div class="processList-item-word">
                <label>创建人:</label>
                <span>{{ item.createBy == -1 ? '系统' : item.createBy }}</span>
              </div>
              <div class="processList-item-word">
                <label>创建时间:</label>
                <span>{{ item.createTime }}</span>
              </div>
              <div class="processList-item-button">
                <el-button type="primary" plain @click="open(item)">应用</el-button>
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
  </div>
</template>

<script>
  import { designFormDesignServiceAll, postFormDesignServiceRealiseProcessData } from '@/unit/api.js'
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      },
      projectCode: {
        type: String,
        default: ''
      },
      projectValue: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        input: '',
        getData: {
          page: 1,
          limit: 10,
          total: 1
        },
        formList: []
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
      getFormList() {
        designFormDesignServiceAll({
          status: 'enabled',
          tenantId: this.$store.state.tenantId,
          ascription: 'public',
          business: '',
          createBy: '',
          numberCode: '',
          name: '',
          docName: ''
        }).then((res) => {
          this.formList = res.result
        })
      },
      open(item) {
        this.$confirm('应用的公共表单会加入到项目表单中,是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          
          const xml  = JSON.parse(item.content);
          xml.id = 'form_' + Date.parse(new Date())
          var file1 = new File([JSON.stringify(xml.content)], 'test.form', {type: 'text/xml'});
          let formData = new FormData()
          formData.append('name', item.name)
          formData.append('docName', item.name +'.form')
          formData.append('ascription', this.projectCode)
          formData.append('code', xml.id)
          formData.append('business', this.projectValue)
          formData.append('status', 'enabled')
          formData.append('createBy', this.$store.state.userInfo.name)
          formData.append('createName', this.$store.state.userInfo.name)
          formData.append('tenantId', this.$store.state.tenantId)
          formData.append('file', file1)
          postFormDesignServiceRealiseProcessData(formData).then((res) => {
            this.$message.success('应用至项目表单成功')
          })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '取消创建'
          // });
        });
      },
      changEnergy(value) {
        this.getData.systemType = value
      },
      detailsShow() {
        this.$refs.detailsRem.dialogVisible2 = true
      }
    },
    mounted() {
      this.getFormList()
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
  
  .processList {
    height: 600px;
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
