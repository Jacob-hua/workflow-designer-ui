<template>
  <div>
    <div v-if="businessList.length === 0" class="empty">
      <p>当前尚无业务数据,请先进行业务配置</p>
    </div>
    <div class="businessCall-main-list">
      <div v-for="(item, index) in businessList" :key="index" class="businessCall-main-list-card">
        <div class="card-main">
          <div><label>项目名称:</label> <long-text :content="item.name" /></div>
          <div>
            <label>项目类型:</label> <span>{{ item.typeName }}</span>
          </div>
          <div>
            <label>创建人:</label> <span>{{ item.createBy }}</span>
          </div>
        </div>
        <div class="btnBox">
          <div
            class="btn"
            @click="showStartDialog(item.id)"
            v-role="{
              id: 'StartItemConfigAdd',
              type: 'button',
              business: business,
            }"
          >
            配置
          </div>
        </div>
      </div>
    </div>
    <div>
      <StartItemForm :businessData="businessData" :visible.sync="footFlag" />
    </div>
  </div>
</template>

<script>
import StartItemForm from './StartItemForm.vue'
import longText from '../../../component/LongText.vue'
import { getBusinessConfigBasicList, getBusinessConfigWithTree } from '@/api/globalConfig'
import { mapState } from 'vuex'

export default {
  components: {
    StartItemForm,
    longText,
  },
  name: 'index',
  data() {
    return {
      businessList: [],
      footFlag: false,
      StartFlag: false,
      currentId: null,
      businessData: [],
      business: '',
    }
  },
  mounted() {
    this.getBusinessConfigBasicList()
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId']),
  },
  methods: {
    async showStartDialog(id) {
      const { errorInfo, result } = await getBusinessConfigWithTree(id, +this.tenantId)
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg)
        return
      }
      this.footFlag = true
      this.businessData = result
    },
    getBusinessConfigBasicList() {
      getBusinessConfigBasicList(this.tenantId).then((res) => {
        this.businessList = res.result
      })
    },
  },
}
</script>

<style scoped>
label {
  color: #999999;
}

.btnBox {
  display: flex;
  justify-content: right;
  margin-top: 29px;
}

.btn {
  width: 68px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border: 1px solid #009efb;
  border-radius: 4px;
  color: #009efb;
  margin-left: 10px;
  cursor: pointer;
}
.config {
  margin-left: 30px;
  margin-right: 40px;
}
.empty {
  height: 800px;
  position: absolute;
  top: 400px;
  left: 40%;
}
.empty p {
  color: #0066cc;
  font-size: 18px;
}
.empty button {
  width: 150px;
  margin-left: 70px;
}
.businessCall-main-list {
  padding: 20px 0px;
  display: flex;
  flex-wrap: wrap;
}
.businessCall-main-list-card {
  color: #fff;
  position: relative;
  line-height: 40px;
  width: 280px;
  height: 186px;
  border: 1px solid #0066cc;
  background: #212739;
  border-radius: 5px;
  font-size: 14px;
  padding: 10px 20px;
  display: inline-block;
  margin-right: 40px;
  margin-bottom: 10px;
  box-sizing: content-box;
}

.businessCall-main-list-add .el-icon-plus {
  font-size: 40px;
  color: #1d89ff;
}
.businessCall-main-list-add:hover {
  background-color: rgba(0, 0, 255, 0.3);
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
}
.card-main label {
  display: inline-block;
  width: 80px;
}
</style>
