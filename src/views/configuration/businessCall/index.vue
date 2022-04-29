<template>
  <div class="businessCall">
    <div class="businessCall-main">
      <div class="businessCall-main-title">
        <el-button type="primary">批量导入</el-button>
      </div>
      <div class="businessCall-main-list">
        <div class="businessCall-main-list-card">
          <div class="card-popover">
            <el-popover
                placement="bottom"
                trigger="click">
                <div style="width: 5px;">1</div>
                <el-button slot="reference">···</el-button>
              </el-popover>
          </div>
          <div class="card-main">
            <div><label>项目名称:</label> <span>北七家</span></div>
            <div><label>项目类型:</label> <span>工业</span></div>
            <div><label>创建人:  </label> <span>昊昊</span></div>
            <div><label>创建时间:</label> <span>2022-04-02 11:14:25</span></div>
          </div>
        </div>
        <div class="businessCall-main-list-add">
          <div>
            <i class="el-icon-plus"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
</script>

<style scoped="scoped">
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
