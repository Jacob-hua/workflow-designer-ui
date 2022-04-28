<template>
  <div class="history_head_top">
    <div class="history_head_top_left">
      <div class="his_block">
        <p class="number">242</p>
        <p class="tit">当月累计工作流</p>
      </div>
      <div class="his_block">
        <p class="number">142</p>
        <p class="tit">当月完成工作流</p>
      </div>
      <div class="his_block">
        <p class="number">2小时5分钟</p>
        <p class="tit">平均完成时长</p>
      </div>
    </div>
    <div class="history_head_top_right">
      <div class="his_block">
        <p class="number">242</p>
        <p class="tit">当日累计工作流</p>
      </div>
      <div class="his_block">
        <p class="number">142</p>
        <p class="tit">当日完成工作流</p>
      </div>
      <div class="his_block">
        <p class="number">1小时5分钟</p>
        <p class="tit">平均完成时长</p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {

      }
    }
  }
</script>

<style scoped>
.history_head_top {
  display: flex;
  margin-top: 20px;
}
.history_head_top_left {
  margin-right: 80px;
}
.history_head_top_left, .history_head_top_right {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 707px;
  height: 142px;
  background-color: rgb(242, 242, 242);
  padding-bottom: 25px;
}
.number {
  font-size: 35px;
  text-decoration: none;
  color: rgb(0, 0, 0);
}
.tit {
  font-size: 15px;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
}
.his_block {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>