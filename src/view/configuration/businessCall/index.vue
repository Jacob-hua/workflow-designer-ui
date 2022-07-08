<template>
  <div class="businessCall">
    <div class="businessCall-main">
      <div class="businessCall-main-list">
        <div v-for="(item,index) in businessList" :key="index" class="businessCall-main-list-card">
          <div class="card-popover">
            <el-popover
                placement="bottom"
                trigger="click">
              <div class="proBtn"  @click="lookBusiness(item.id)" v-role="{ id: 'BusinessCallLook', type: 'button', business: business }"><i style="cursor: pointer; margin-top: 10px; margin-right: 15px; font-size: 20px; color: #333333" class=" el-icon-s-order"></i>查看</div>
              <div class="proBtn" @click="editBusiness(item.id)" v-role="{ id: 'BusinessCallEdit', type: 'button', business: business }"><i style="cursor: pointer; margin-top: 10px; margin-right: 15px;font-size: 20px; color: #333333" class=" el-icon-edit-outline"></i>编辑</div>
              <div class="proBtn" @click ='deleteBusinessConfig(item)' v-role="{ id: 'BusinessCallDelete', type: 'button', business: business }" ><i style="cursor: pointer; margin-top: 10px; margin-right: 15px;font-size: 20px; color: #333333" class="el-icon-delete"></i>删除</div>
              <el-button slot="reference">···</el-button>
            </el-popover>
          </div>
          <div class="card-main">
            <div><label>项目名称:</label> <span>{{ item.name }}</span></div>
            <div><label>项目类型:</label> <span>{{ item.typeName }}</span></div>
            <div><label>创建人:  </label> <span>{{item.createBy}}</span></div>
            <div><label>创建时间:</label> <span>{{ item.createTime }}</span></div>
          </div>
        </div>
        <div @click="showGuide" class="businessCall-main-list-add" v-role="{ id: 'BusinessCallAdd', type: 'button', business: business }">
          <div>
            <i class="el-icon-plus"></i>
          </div>
        </div>
      </div>
    </div>
    <Guide
        ref="guide"
        @showAddDialog="showAddDialog"
    />
    <BusinessCon
        ref="BusinessCon"
        :showBtn="showBtn"
        :edit = "edit"
        :type="type"
        @showAddOrEidtDailog="showAddOrEidtDailog"
    />
  </div>
</template>

<script>
import Guide from "@/view/configuration/businessCall/Guide";
import BusinessCon from "@/view/configuration/businessCall/BusinessCon";
import {
  getBusinessConfigBasicList,
  getDicDataByClassify,
  getBusinessConfigWithTree, deleteBusinessConfig
} from "@/api/globalConfig";
import { mapState } from  'vuex'
export default {
  components: {
    Guide,
    BusinessCon
  },
  data() {
    return {
      edit: false,
      showBtn: true,
      businessList: [],
      business: '',
      type: 'see'
    }
  },
  mounted() {
    this.getBusinessConfigBasicList()
    this.getDicDataByClassify()
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId'])
  },
  methods: {
    deleteBusinessConfig(row) {
      deleteBusinessConfig({
        id: parseInt(row.id),
        projectCode: row.code,
        tenantId: this.tenantId,
        updateBy: this.userInfo.account
      }).then(res=> {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        
        this.getBusinessConfigBasicList()
      })
    },
    getDicDataByClassify() {
      getDicDataByClassify().then(res=> {
        this.$refs.guide.projectOption = res.result
      })
    },
    getBusinessConfigBasicList() {
      getBusinessConfigBasicList(this.tenantId).then(res => {
        this.businessList = res.result
      })
    },

    lookBusiness(id) {
      this.type = 'see'
      // 获取组织 结构树
      getBusinessConfigWithTree(id, +this.tenantId).then(res => {
        this.$refs.BusinessCon.dialogVisible = true
        this.$refs.BusinessCon.editFlag = false
        this.showBtn = false
        this.$refs.BusinessCon.data = res.result
      })

    },
    editBusiness(id) {
      this.type = 'edit'
      getBusinessConfigWithTree(id, +this.tenantId).then(res => {
        this.$refs.BusinessCon.dialogVisible = true
        this.$refs.BusinessCon.editFlag = true
        this.edit = true
        this.showBtn = true
        this.$refs.BusinessCon.data = res.result
      })

    },
    showAddOrEidtDailog() {
      this.$refs.guide.dialogVisible = true
    },
    showAddDialog(form) {
      this.$refs.BusinessCon.dialogVisible = true
      this.$refs.BusinessCon.editFlag = true
      this.$refs.BusinessCon.btnTxt = '预览'
      this.$refs.BusinessCon.data = [
            {
              "code": form.code,
              "label": '莱芜供热项目',
              "name": '',
              "active": "Y",
              "type": 'industry',
              "parentId":	-1,
              "createBy": this.userInfo.account,
              "tenantId": this.tenantId,
              "ascription": form.code
            }
        ]
      this.$refs.BusinessCon.data[0].label = form.name
      this.$refs.BusinessCon.data[0].name = form.name
      this.$refs.BusinessCon.forms = form
      this.$refs.BusinessCon.businessConfigWithTreeCreate(this.$refs.BusinessCon.data[0])
      this.showBtn = true
    },
    showGuide() {
      this.$refs.guide.dialogVisible = true
      this.$refs.guide.form =  {
            name: '',
            type: '',
            code: '',
            tenantId: this.tenantId
      }
    }
  }
}
</script>

<style scoped lang="scss">
label {
  color: #999999;
}
/deep/ .el-icon-s-order,  .el-icon-edit-outline, .el-icon-delete{
  color: #fff !important;
}
/deep/ .el-popover {
  min-width: unset !important;
  background-color: rgb(242,242,242);
}
.proBtn {
  width: 100%;
  cursor: pointer;
  padding-bottom: 10px;
}
.proBtn:hover {
  background-color: #009EFB;
}
.businessCall {
  padding: 20px 0px;
}
.businessCall-main-title {

}
.card-popover {
  position: absolute;
  right: 10px;
  top: 0px;
}
.card-popover /deep/ .el-button {
  padding: 0px;
  border: none;
  background-color: transparent;
  font-size: 20px;
  font-weight: 700;
  color: #1d89ff;
}
.businessCall-main-list {
  padding: 20px 0px;
  display: flex;
  flex-wrap: wrap;
}
.businessCall-main-list-card {
  position: relative;
  line-height: 40px;
  width: 292px;
  height: 186px;
  margin-bottom: 10px;
  border: 1px solid #0066cc;
  background: #212739;
  border-radius: 5px;
  font-size: 14px;
  padding: 10px 20px;
  display: inline-block;
  margin-right: 40px;
  color: #fff;
}

.businessCall-main-list-add .el-icon-plus {
  font-size: 40px;
  color: #1d89ff;

}
.businessCall-main-list-add:hover {
  background-color: rgba(0,0,255,.3);
}

.businessCall-main-list-add {
  cursor: pointer;
  text-align: center;
  padding: 70px 20px;
  position: relative;
  display: inline-block;
  width: 312px;
  background: #212739;
  height: 67px;
}

.card-main label {
  display: inline-block;
  width: 80px;
}
</style>
