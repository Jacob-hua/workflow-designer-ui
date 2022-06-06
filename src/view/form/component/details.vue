<template>
  <div>
    <el-dialog title="表单详情" :visible.sync="dialogVisible2" width="90%" custom-class="dialogVisible2">
      <div class="dialogVisible2-main">
        <div>
          表单模板
        </div>
        <div class="detail-title">
          <div class="detail-title-item"> <span class="detail-title-item-label">表单编码:</span> <span>{{ formDatas.numberCode }}</span> </div>
          <div class="detail-title-item"> <span class="detail-title-item-label">表单名称:</span> <span>{{ formDatas.name }}</span> </div>
          <div class="detail-title-item"> <span class="detail-title-item-label">创建人:</span> <span>{{ formDatas.createBy }}</span> </div>
          <div class="detail-title-item"> <span class="detail-title-item-label">创建时间:</span> <span>{{ formDatas.createTime }}</span> </div>
          <div class="detail-title-item" v-if="quote == 'delete'"> <span class="detail-title-item-label">发布次数:</span> <span>{{ formDatas.count }}</span> </div>
          
         <div class="detail-title-item-button">
           <el-button type="primary" @click="editForm()" v-role="{ id: 'FromEdit', type: 'button', business: business }">编辑</el-button>
           <el-button type="primary" @click="deleteRow()" v-if="quote == 'delete'" v-role="{ id: 'FromDelete', type: 'button', business: business }">删除</el-button>
           <el-button type="primary" @click="quot()" v-if="quote == 'quote' && status !== 'drafted' " v-role="{ id: 'FromUse', type: 'button', business: business }">应用</el-button>
         </div>
          
        </div>
        <div v-if="status !== 'drafted'">
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
<!--          <formBpmnEdit v-if="dialogVisible2" ref="formbpmn" :key="formBpmnEditKey"></formBpmnEdit>-->
          <preview :itemList="itemList"  :formConf="formConf" v-if="previewVisible"></preview>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="引入工作流" :visible.sync="dialogVisible1" width="35%" custom-class="dialogVisible1">
      <div>
        <div class="from-item">
          <span>应用项目</span>
          <el-select v-model="postData.ascription" placeholder="请选择应用项目">
            <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="from-item">
          <span>流程类型</span>
          <el-select v-model="postData.business" placeholder="请选择流程类型">
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!-- <div class="from-item">
          <span>能源系统</span>
          <el-select v-model="postData.systemType" placeholder="请选择能源系统">
            <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div> -->
        <div class="from-item">
          <span>表单名称</span>
          <el-input v-model="postData.name" placeholder="请输入部署名称"></el-input>
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
  import preview from "@/plugin/FormDesign/component/preview";
  import { postFormDesignRecordFormDesignRecordInfo, deleteFormDesignService, postFormDesignServiceRealiseProcessData } from '@/api/unit/api.js'
  import Preview from "@/plugin/FormDesign/component/preview";
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
      },
      formDatas: {
        type: Object
      }
    },
    watch: {
      formDatas:{
        deep: true,
        immediate: true,
        handler(newValue, oldValue) {
          console.log('21213')
          debugger
          let content = JSON.parse(newValue.content)
          let list = content.list
          for (const formItem of list) {
            if (formItem.columns && formItem.columns.length) {
              for (const formItemElement of formItem.columns) {
                for (const formItemElementElement of formItemElement.list) {
                  formItemElementElement.disabled = true
                }
              }
            } else {
              if ( Object.keys(formItem).includes('disabled')) {
                formItem.disabled  =  true
              } else  {}
            }
          }
        this.itemList = list
        }
      }
    },
    computed: {
      formConf: function ()  {
        return JSON.parse(this.formDatas.content).config
      }
    },
    data() {
      return {
        itemList: [],
        previewVisible:false,
        dialogVisible2: false,
        dialogVisible1: false,
        // formData: {
        //   numberCode: '',
        //   name: '',
        //   createName: '',
        //   createTime: ''
        // },
        options: [],
        formBpmnEditKey: 0,
        value: '',
        postData: {
          ascription: '',
          business: '',
          systemType: '',
          name: ''
        },
        input: '',
        options1: [
         {
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
         },
        ],
        options2: [
          {
            value: '',
            label: '全部业务'
          }
        ],
        options3: [
          {
            value: 'energy-1',
            label: '配电'
          },
          {
            value: 'energy-2',
            label: '空压'
          },
          {
            value: 'energy-3',
            label: '供暖'
          },
          {
            value: 'energy-4',
            label: '空调'
          }
        ]
      }
    },
    components:{
      Preview,
      formBpmnEdit,
      preview
    },
    methods:{
      deleteRow() {
        this.$confirm('表单删除不可恢复, 请确认是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteFormDesignService(this.value || this.formDatas.id ).then((res) => {
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
          tenantId: this.$store.state.tenantId,
          ascription: this.ascription,
          business: this.business,
          createBy: this.$store.state.userInfo.name
        }).then((res) => {
          this.formDatas = res.result
          this.formBpmnEditKey++
          this.$nextTick(() => {
            this.$refs.formbpmn.schema = JSON.parse(res.result.content)
            this.$refs.formbpmn.init()
          })
        })
      },
      editForm() {
        this.$emit('editForm', this.formDatas)
      },
      nextDiolog() {
        const xml  = this.$refs.formbpmn.importData();
        xml.id = 'form_' + Date.parse(new Date())
        var file1 = new File([JSON.stringify(xml)], 'test.form', {type: 'text/xml'});
        let formData = new FormData()
        formData.append('name', this.postData.name)
        formData.append('docName', this.postData.name +'.form')
        formData.append('ascription', this.postData.ascription)
        formData.append('code', xml.id)
        formData.append('business', this.postData.business)
        formData.append('status', 'enabled')
        formData.append('createBy', this.$store.state.userInfo.name)
        formData.append('createName', 'admin')
        formData.append('tenantId', this.$store.state.tenantId)
        formData.append('file', file1)
        postFormDesignServiceRealiseProcessData(formData).then((res) => {
          this.$message.success('发布至可用表单成功')
          this.dialogVisible1 = false
          this.dialogVisible2 = false
        })
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
