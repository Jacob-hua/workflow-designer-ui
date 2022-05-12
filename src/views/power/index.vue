<template>
  <div class="power">
    <div class="projectHeader">
      <el-select v-model="projectCode" placeholder="请选择" @change="changProjectCode">
        <el-option v-for="item in $store.state.optionsAscription" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        projectCode: 'beiqijia'
      }
    }
  }
</script>

<style scoped="scoped">
  .power {
    padding: 20px 30px;
  }
  .projectHeader {
    display: inline-block;
    margin: 0px 0px 20px 0px;
  }
</style>
