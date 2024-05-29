<template>
  <div class="system-management">
    <el-tabs v-model="activeName" type="border-card"  @tab-click="handleClick">
      <el-tab-pane label="API管理" name="first">
        <ApiList />
      </el-tab-pane>
      <el-tab-pane label="字典管理" name="second">
        <Dictionary />
      </el-tab-pane>
    </el-tabs>
    </div>
</template>

<script>
import ApiList from './apiList/index.vue'
import Dictionary from './dictionary/index.vue'
export default {
    components: {
        ApiList,
        Dictionary
    },
    data() {
        return {
            activeName: 'first'
        }
    },
    methods: {
        handleClick() {
            console.log(123)
        }
    }
}
</script>

<style lang="scss" scoped>
.system-management {
    overflow: hidden;
}
</style>
