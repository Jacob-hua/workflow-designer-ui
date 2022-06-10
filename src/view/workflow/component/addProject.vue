<template>
  <el-dialog :title="title"
             :visible="dialogVisible"
             :before-close="handleClose"
             width="35%"
             custom-class="addProject">
    <div>
      <div class="from-item">
        <span>应用项目</span>
        <el-select v-model="projectCode"
                   disabled>
          <el-option v-for="item in projectOption"
                     :key="item.id"
                     :label="item.name"
                     :value="item.code"></el-option>
        </el-select>
      </div>
      <div class="from-item">
        <span>流程类型</span>
        <el-cascader style="width: 350px"
                     v-model="postData.business"
                     :options="systemOption"
                     :props='sysProps'></el-cascader>
      </div>
      <div class="from-item">
        <span>流程名称</span>
        <el-input v-model="postData.name"
                  placeholder="请输入流程名称"></el-input>
      </div>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="define">下一步</el-button>
      <el-button @click="cancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    projectCode: {
      type: String,
      default: '',
    },
    dialogVisible: {
      type: Boolean,
      default: true,
    },
    projectOption: {
      type: Array,
      default: () => [],
    },
    systemOption: {
      type: Array,
      default: () => [],
    },
    sysProps: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      postData: {
        ascription: this.projectCode,
        business: '',
        name: '',
      },
      title: '新建工作流',
    }
  },
  computed: {
    ...mapState(['optionsBusiness']),
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    cancel() {
      this.$emit('close')
    },
    define() {
      if (this.postData.name) {
        if (this.postData.name.length > 2) {
          this.$emit('define', this.postData)
        } else {
          this.$message.warning('流程名称长度必须大于二')
        }
      } else {
        this.$message.warning('请填写流程名称')
      }
    },
  },
}
</script>

<style scoped>
::v-deep .addProject .el-dialog__body {
  padding: 16px 180px 0px 100px;
}

::v-deep .addProject .el-dialog__header .el-dialog__title {
  font-size: 14px;
}

::v-deep .addProject .el-dialog__header {
  background-color: #e4e4e4;
  border-bottom: 1px solid #000000;
}

.from-item {
  display: flex;
  margin-bottom: 20px;
  text-align: center;
}

.from-item > span {
  width: 100px;
  height: 40px;
  line-height: 40px;
}
</style>
