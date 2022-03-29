<template>
  <div>
    <el-dialog title="表单详情" :visible.sync="dialogVisible2" width="90%" custom-class="dialogVisible2">
      <div class="dialogVisible2-main">
        <div>
          表单模板
        </div>
        <div class="detail-title">
          <div class="detail-title-item"> <span class="detail-title-item-label">表单编码:</span> <span>{{ formData.numberCode }}</span> </div>
          <div class="detail-title-item"> <span class="detail-title-item-label">表单名称:</span> <span>{{ formData.name }}</span> </div>
          <div class="detail-title-item"> <span class="detail-title-item-label">创建人:</span> <span>{{ formData.createName }}</span> </div>
          <div class="detail-title-item"> <span class="detail-title-item-label">创建时间:</span> <span>{{ formData.createTime }}</span> </div>
          <div class="detail-title-item" v-if="quote == 'delete'"> <span class="detail-title-item-label">发布次数:</span> <span>{{ formData.count }}</span> </div>
          
         <div class="detail-title-item-button">
           <el-button type="primary" @click="editForm()">编辑</el-button>
           <el-button type="primary" @click="deleteRow()" v-if="quote == 'delete'">删除</el-button>
           <el-button type="primary" @click="quot()" v-if="quote == 'quote'">应用</el-button>
         </div>
          
        </div>
        <div>
          <div class="optionV">
            <el-select v-model="value" placeholder="请选择" @change="upDataV()">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </div>
        </div>
        <div class="fromEdit">
          <formBpmnEdit v-if="dialogVisible2" ref="formbpmn" :key="formBpmnEditKey"></formBpmnEdit>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="引入工作流" :visible.sync="dialogVisible1" width="35%" custom-class="dialogVisible1">
      <div>
        <div class="from-item">
          <span>应用项目</span>
          <el-select v-model="input" placeholder="请选择应用项目">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="from-item">
          <span>流程类型</span>
          <el-select v-model="input" placeholder="请选择流程类型">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="from-item">
          <span>能源系统</span>
          <el-select v-model="input" placeholder="请选择能源系统">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="from-item">
          <span>表单名称</span>
          <el-input v-model="input" placeholder="请输入部署名称"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="nextDiolog()" type="primary">确认</el-button>
        <el-button @click="dialogVisible1 = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import formBpmnEdit from './formBpmnEdit.vue'
  import { postFormDesignRecordFormDesignRecordInfo, deleteFormDesignService } from '@/unit/api.js'
  export default {
    props:{
      quote: {
        type: String,
        default: 'quote'
      },
      status: {
        type: String,
        default: ''
      },
      ascription: {
        type: String,
        default: 'public'
      },
      business: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        dialogVisible2: false,
        dialogVisible1: false,
        formData: {
          numberCode: '',
          name: '',
          createName: '',
          createTime: ''
        },
        formBpmnEditKey: 0,
        value: '',
        input: '',
        options: [{
          value: 'V1.0',
          label: 'V1.0'
        }]
      }
    },
    components:{
      formBpmnEdit
    },
    methods:{
      deleteRow() {
        this.$confirm('表单删除不可恢复, 请确认是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteFormDesignService(this.value || this.formData.id ).then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.$emit('deleteSuccsee')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      upDataV() {
        postFormDesignRecordFormDesignRecordInfo({
          id: this.value,
          status: this.status,
          tenantId: 12,
          ascription: this.ascription,
          business: this.business,
          createId: 1
        }).then((res) => {
          this.formData = res.result
          this.formBpmnEditKey++
          this.$nextTick(() => {
            this.$refs.formbpmn.schema = JSON.parse(res.result.content)
            this.$refs.formbpmn.init()
          })
        })
      },
      editForm() {
        this.$emit('editForm', this.formData)
      },
      nextDiolog() {
        this.dialogVisible1 = false
        this.dialogVisible2 = false
      },
      quot() {
        this.dialogVisible1 = true
      }
    }
  }
</script>

<style scoped="scoped">
  
  /deep/ .dialogVisible1 .el-dialog__body {
     padding: 16px 180px 0px 100px;
   }
   
   /deep/ .dialogVisible1 .el-dialog__header .el-dialog__title {
     font-size: 14px;
   }
   
   /deep/ .dialogVisible1 .el-dialog__header {
     background-color: #e4e4e4;
     border-bottom: 1px solid #000000;
   }
  
  .from-item {
    display: flex;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .from-item>span {
    width: 100px;
    height: 40px;
    line-height: 40px;
  }
  
  /deep/ .el-input__inner {
    color: black;
  }
  
  /deep/ .el-dialog__footer {
    text-align: center;
  }
  
  .form-title {
    border-bottom: 1px solid #CCCCCC;
    margin-bottom: 40px;
  }
  .title-item {
    display: inline-block;
    margin-bottom: 20px;
  }
  .title-item-label {
    margin-right: 15px;
  }
  .title-item-main {
    display: inline-block;
  }
  
  /deep/ .dialogVisible2 .el-dialog__header .el-dialog__title {
    font-size: 14px;
  }
  
  /deep/ .dialogVisible2 .el-dialog__header {
    background-color: #e4e4e4;
    border-bottom: 1px solid #000000;
  }
  
  .detail-title {
    /* display: flex; */
    margin-top: 20px;
    padding-bottom: 40px;
    border-bottom: 1px solid #CCCCCC;
  }
  
  .detail-title-item {
    margin-right: 60px;
    display: inline-block;
  }
  
  .detail-title-item-label {
    display: inline-block;
    margin-right: 10px;
  }
  
  .detail-title-item-button {
    margin-top: -10px;
    float: right;
  }
  
  .optionV {
    margin-top: 10px;
    display: inline-block;
  }
  
  .fromEdit {
    height: 660px;
    margin-top: 20px;
  }
</style>
