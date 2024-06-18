<template>
    <div class="data-transform-wrapper">
        <el-card>
            <div slot="header" class="clearfix">
                <span>知识库组件</span>
            </div>
            <el-form v-if="$attrs.isShowInsCode" ref="form" label-width="80px">
                <el-form-item label="实例">
                    <el-input v-model="model" disabled />
                </el-form-item>
            </el-form>
            <p style="color: rgba(255, 255, 255, 0.7)">本组件将自动拉取工单关联的知识库细项</p>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'Display',
    data() {
        return {
            model: []
        }
    },
    mounted() {
        console.log(this.$attrs, 555555555)
    }
}
</script>

<style lang="scss" scoped>
.data-transform-wrapper {
    margin-bottom: 20px;
}
</style>
