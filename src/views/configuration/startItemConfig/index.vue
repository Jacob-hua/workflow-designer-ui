<template>
  <div>
    <div v-if="1==0" class="empty">
      <p>当前尚无业务数据,请先进行业务配置</p>
      <el-button>创建</el-button>
    </div>
    <div class="businessCall-main-list">
      <div class="businessCall-main-list-card">
        <div class="card-main">
          <div><label>项目名称:</label> <span>北七家</span></div>
          <div><label>项目类型:</label> <span>工业</span></div>
          <div><label>配置时间:</label> <span>2022-04-02 11:14:25</span></div>
        </div>
        <el-button @click="showSartDailog" class="config">配置</el-button>
        <el-button>查看</el-button>
      </div>
    </div>
    <StartItemCon
      ref="StartItemCon"
    />
  </div>
</template>

<script>
  import StartItemCon from "@/views/configuration/startItemConfig/startItemCon";
export default {
  components: {
    StartItemCon
  },
  name: "index",
  data() {
    return{
      itemconFlag : false
    }
  },
  methods: {
    showSartDailog() {
      this.$refs.StartItemCon.dialogVisible = true
    }
  }
}
</script>

<style scoped>
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
    color: #0066CC;
    font-size: 18px;
  }
  .empty button {
    width: 150px;
    margin-left: 70px;
  }
  .businessCall-main-list {
    padding: 20px 0px;
    display: flex;
  }
  .businessCall-main-list-card {
    position: relative;
    line-height: 40px;
    width: 312px;
    height: 186px;
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
</style>