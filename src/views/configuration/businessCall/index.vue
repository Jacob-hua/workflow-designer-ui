<template>
  <div class="businessCall">
    <div class="businessCall-main">
<!--      <div class="businessCall-main-title">-->
<!--        <el-button type="primary" v-role="{ id: 'BusinessCallImport', type: 'button', business: business }">批量导入</el-button>-->
<!--      </div>-->
      <div class="businessCall-main-list">
        <div @click="showGuide" class="businessCall-main-list-add" style="margin-right: 40px" v-role="{ id: 'BusinessCallAdd', type: 'button', business: business }">
          <div>
            <i class="el-icon-plus"></i>
          </div>
        </div>
        <div v-for="(item,index) in businessList" :key="index" class="businessCall-main-list-card">
          <div class="card-popover">
            <el-popover
                placement="bottom"
                trigger="click">
              <div  @click="lookBusiness(item.id)"><i style="margin-top: 10px; margin-right: 15px; font-size: 20px; color: #333333" class=" el-icon-s-order" v-role="{ id: 'BusinessCallLook', type: 'button', business: business }"></i>查看</div>
              <div  @click="editBusiness(item.id)"><i style="margin-top: 10px; margin-right: 15px;font-size: 20px; color: #333333" class=" el-icon-edit-outline" v-role="{ id: 'BusinessCallEdit', type: 'button', business: business }"></i>编辑</div>
              <div @click ='deleteBusinessConfig(item.id)' ><i style="margin-top: 10px; margin-right: 15px;font-size: 20px; color: #333333" class="el-icon-delete" v-role="{ id: 'BusinessCallDelete', type: 'button', business: business }"></i>删除</div>
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
        @showAddOrEidtDailog="showAddOrEidtDailog"
    />
  </div>
</template>

<script>
import Guide from "@/views/configuration/businessCall/Guide";
import BusinessCon from "@/views/configuration/businessCall/BusinessCon";
import {
  getBusinessConfigBasicList,
  getDicDataByClassify,
  getBusinessConfigWithTree, deleteBusinessConfig
} from "@/api/globalConfig";
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
      business: ''
    }
  },
  mounted() {
    this.getBusinessConfigBasicList()
    this.getDicDataByClassify()
  },
  methods: {
    deleteBusinessConfig(id) {
      deleteBusinessConfig(id).then(res=> {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getBusinessConfigBasicList()
      })
    },
    getDicDataByClassify() {
      getDicDataByClassify().then(res=> {
        console.log(res)
        this.$refs.guide.projectOption = res.result
      })
    },
    getBusinessConfigBasicList() {
      getBusinessConfigBasicList(this.$store.state.tenantId).then(res => {
        console.log(res)
        this.businessList = res.result
      })
    },

    lookBusiness(id) {
      // 获取组织 结构树
      getBusinessConfigWithTree(id, +this.$store.state.tenantId).then(res => {
        console.log(res)
        this.$refs.BusinessCon.dialogVisible = true
        this.$refs.BusinessCon.editFlag = false
        this.showBtn = false
        this.$refs.BusinessCon.data = res.result
      })

    },
    editBusiness(id) {
      getBusinessConfigWithTree(id, +this.$store.state.tenantId).then(res => {
        console.log(res)
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
              "code": 1,
              "label": '莱芜供热项目',
              "name": '',
              "active": "Y",
              "type": 'industry',
              "parentId":	-1,
              "createBy": this.$store.state.userInfo.name,
              "tenantId": this.$store.state.tenantId
            }
        ]
      this.$refs.BusinessCon.data[0].label = form.name
      this.$refs.BusinessCon.data[0].name = form.name
      this.$refs.BusinessCon.forms = form
      this.showBtn = true
    },
    showGuide() {
      this.$refs.guide.dialogVisible = true
      this.$refs.guide.form =  {
            name: '',
            type: '',
            code: '',
            tenantId: this.$store.state.tenantId
      }
    }
  }
}
</script>

<style scoped="scoped">
/deep/ .el-popover {
  min-width: unset !important;
  background-color: rgb(242,242,242);
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
  width: 312px;
  height: 186px;
  margin-bottom: 10px;
  border: 1px solid #0066cc;
  background-color: #f5f7f9;
  border-radius: 5px;
  font-size: 14px;
  padding: 10px 20px;
  display: inline-block;
  margin-right: 40px;
}

.businessCall-main-list-add .el-icon-plus {
  font-size: 40px;
  /* color: #e4e4e4; */
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
  height: 186px;
  background-color: #f5f7f9;
  /* border: 1px solid #0066cc; */
}

.card-main label {
  display: inline-block;
  width: 80px;
}
</style>
