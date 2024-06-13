<template>
    <div class="choose-eq-wrapper">
        <el-card>
            <div slot="header" class="clearfix">
                <span>设备选择</span>
            </div>
            <el-form ref="form" :model="formData" label-width="80px">
                <el-form-item label="设备">
                    <el-select v-model="formData.eq" placeholder="请选择设备">
                    </el-select>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'Abnormal',
    data() {
        return {
            formData: {
                eq: '',
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.choose-eq-wrapper {
    margin-bottom: 20px;
}
</style>
