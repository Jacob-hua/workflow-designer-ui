<template>
  <div>
    <el-dialog title="表单详情" :visible.sync="dialogVisible2" fullscreen top="1vh" width="90%" custom-class="dialogVisibleEdit">
      <div class="dialogVisible2-main">
        <div class="detail-title">
          <div class="detail-title-item"> <span class="detail-title-item-label">表单编码:</span> <span>{{ formDatas.numberCode }}</span> </div>
          <div class="detail-title-item"> <span class="detail-title-item-label">表单名称:</span> <span>{{ formDatas.name }}</span> </div>
          <div v-if="ascriptionName" class="detail-title-item"> <span class="detail-title-item-label">项目名称:</span> <span>{{ ascriptionName }}</span> </div>
          <div v-if="businessName" class="detail-title-item"> <span class="detail-title-item-label">业务类型:</span> <span>{{ businessName }}</span> </div>
          <div class="detail-title-item"> <span class="detail-title-item-label">创建人:</span> <span>{{ formDatas.createBy }}</span> </div>
          <div class="detail-title-item"> <span class="detail-title-item-label">创建时间:</span> <span>{{ formDatas.createTime }}</span> </div>
          <div class="detail-title-item" v-if="quote == 'delete'"> <span class="detail-title-item-label">发布次数:</span> <span>{{ formDatas.count }}</span> </div>
         <div class="detail-title-item-button">
           <el-button class="primary" type="primary" @click="editForm()" v-role="{ id: 'FromEdit', type: 'button', business: business }">编辑</el-button>
           <el-button class="primary" type="primary" @click="deleteRow()" v-if="quote == 'delete'" v-role="{ id: 'FromDelete', type: 'button', business: business }">删除</el-button>
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
          <preview :itemList="itemList"  :formConf="formConf" v-if="dialogVisible2"></preview>
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
  import { mapState } from 'vuex'
  import {getAllBusinessConfig} from "@/api/globalConfig";
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
          if (newValue.content) {
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
            this.$nextTick(() => {
              let ql_blank = document.querySelector('.ql-blank')
              if (ql_blank) {
                ql_blank.setAttribute('contenteditable', false)
              }
            })
          }
        }
      }
    },
    computed: {
      formConf: function ()  {
        return JSON.parse(this.formDatas.content).config
      },
      ...mapState('account', ['tenantId', 'userInfo']),
    },
    data() {
      return {
        ascriptionName: '',
        businessName: '',
        itemList: [],
        previewVisible:false,
        dialogVisible2: false,
        dialogVisible1: false,
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
        options1: [],
        options2: [],
        options3: []
      }
    },
    components:{
      Preview,
      formBpmnEdit,
      preview
    },
    methods:{
      getAllBusinessConfig(data) {
        getAllBusinessConfig({tenantId: data.tenantId}).then(res=> {
          let result = res.result?? []
          result.forEach(item => {
            if (item.code === data.ascription) {
              this.ascriptionName = item.name
            }
            if (item.code === data.business) {
              this.businessName = item.name
            }
          })
        })
      },

      deleteRow() {
        this.$confirm('表单删除不可恢复, 请确认是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteFormDesignService({
            id: this.value || this.formDatas.id,
            updateBy: this.userInfo.account
          }).then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.$emit('deleteSuccsee')
          })
        }).catch(() => {
        });
      },
      upDataV() {
        postFormDesignRecordFormDesignRecordInfo({
          id: this.value,
          status: this.status,
          tenantId: this.tenantId,
          ascription: this.ascription,
          business: this.business,
          createBy: this.userInfo.account
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
        formData.append('createBy', this.userInfo.account)
        formData.append('createName', 'admin')
        formData.append('tenantId', this.tenantId)
        formData.append('file', file1)
        postFormDesignServiceRealiseProcessData(formData).then((res) => {
          this.$message.success('发布至可用表单成功')
          this.dialogVisible1 = false
          this.dialogVisible2 = false
        })
      }
    }
  }
</script>

<style scoped lang="scss">
/deep/ .dialogVisibleEdit {
  width: 100% !important;
}
.primary {
  @include primaryBtn;
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
  .detail-title {
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
    margin-top: -30px;
    display: flex;
    justify-content: flex-end;
  }
  
  .optionV {
    margin-top: 10px;
    display: inline-block;
  }
  
  .fromEdit {
    overflow-x: hidden;
    overflow-y: auto;
    height: 660px;
    margin-top: 20px;
  }
</style>
