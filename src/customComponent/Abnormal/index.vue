<template>
    <div class="abnormal-wrapper">
        <el-card>
            <div slot="header" class="clearfix">
                <span>异常报修</span>
            </div>
            <el-form ref="form" :model="formData" label-width="80px">
                <el-form-item label="异常设备">
                    <el-select v-model="formData.eq" placeholder="请选择设备">
                    </el-select>
                </el-form-item>
                <el-form-item label="异常类型">
                    <el-select v-model="formData.type" placeholder="请选择类型">
                    </el-select>
                </el-form-item>
                <el-form-item label="异常时间">
                    <el-date-picker type="date" placeholder="选择日期" v-model="formData.date"></el-date-picker>
                </el-form-item>
                <el-form-item label="异常描述">
                    <el-input type="textarea" v-model="formData.desc"></el-input>
                </el-form-item>
                <el-form-item label="异常描述">
                    <el-input type="textarea" v-model="formData.remark"></el-input>
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
                type: '',
                date: '',
                desc: '',
                remark: ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.abnormal-wrapper {
    margin-bottom: 20px;
}
</style>
