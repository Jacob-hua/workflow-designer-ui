<template>
    <div class="data-transform-wrapper">
        <el-card>
            <div slot="header" class="clearfix">
                <span>数据抄录</span>
            </div>
            <el-form ref="form" label-width="80px">
                <el-form-item label="模型">
                    <el-input v-model="model" />
                </el-form-item>
                <el-form-item label="属性">
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'DataTransform',
    data() {
        return {
            model: []
        }
    },
    mounted() {
        console.log(this.props)
    }
}
</script>

<style lang="scss" scoped>
.data-transform-wrapper {
    margin-bottom: 20px;
}
</style>
