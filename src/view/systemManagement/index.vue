<template>
    <div class="system-management">
        <el-tabs v-model="activeName" type="border-card"  @tab-click="handleClick">
          <el-tab-pane label="API管理" name="first">
            <ApiList />
          </el-tab-pane>
            <!-- <el-tab-pane label="公共表单" name="first">
              <PublicForm v-if="activeName === 'first'"></PublicForm>
            </el-tab-pane> -->
        </el-tabs>
      </div>
</template>

<script>
import ApiList from './apiList/index.vue'
export default {
    components: {
        ApiList
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
