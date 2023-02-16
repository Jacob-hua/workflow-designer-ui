<template>
  <div>
    <el-dialog
      title="启动项配置"
      :visible="visible"
      :close-on-click-modal="false"
      width="80%"
      @close="onClose"
      fullscreen
      append-to-body
    >
      <div class="start_container">
        <div class="start_left">
          <PeTree
            nodeKey="id"
            labelName="name"
            @nodeClick="handleNodeClick"
            :data="businessData"
            :props="peTreeProps"
          ></PeTree>
        </div>
        <div class="start_right">
          <div class="form-preview">
            <div class="title">
              <div>启动项表单</div>
              <el-button class="remove-button" v-if="formShow" @click="onRemoveForm"> 移除表单 </el-button>
            </div>
            <div class="content-wrapper form">
              <div v-if="formShow">
                <preview :itemList="formContent.fields" :formConf="formContent.config"></preview>
              </div>
              <div v-else class="empty-data">当前未关联表单</div>
            </div>
          </div>
          <div class="form-list-wrapper">
            <div class="title">表单筛选</div>
            <div class="search-form">
              <el-input v-model="formName" placeholder="请输入内容" @keyup.native.enter="fetchFormList"></el-input>
            </div>
            <div class="content-wrapper">
              <div v-for="{ id, version, name, formContent: { list: fields, config }, docName } in formList" :key="id">
                <div class="info">
                  <div>{{ name }}</div>
                  <div>
                    {{ version }}
                  </div>
                </div>
                <div class="operations">
                  <el-popover placement="right" width="400" trigger="click">
                    <preview class="preview-popper" :itemList="fields" :formConf="config"></preview>
                    <span class="preview-button" slot="reference"> 查看 </span>
                  </el-popover>
                  <span class="link-button" @click="onLinked({ id, docName, fields, config })"> 关联 </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSelectProcessStartForm, linkStartForm, removeStartForm } from '@/api/globalConfig'
import { designFormDesignServiceAll } from '@/api/unit/api.js'
import preview from '@/plugin/FormDesign/component/preview'
import { mapState } from 'vuex'
import PeTree from '@/component/PeTree.vue'

export default {
  name: 'DeployOptions',
  components: {
    preview,
    PeTree,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    businessData: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      formContent: {},
      formList: [],
      formName: '',
      tableData: [],
      peTreeProps: {
        children: 'children',
        label: 'name',
      },
      activeBusiness: null,
    }
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId']),
    formShow() {
      return Object.keys(this.formContent).length > 0
    },
  },
  methods: {
    onClose() {
      this.formList = []
      this.formContent = {}
      this.$emit('update:visible', false)
    },
    handleNodeClick(data) {
      if (data.parentId !== '-1') {
        this.activeBusiness = data
        this.fetchFormList()
        this.fetchStartFrom()
      }
    },
    async onLinked({ id, fields, config }) {
      const { errorInfo } = await linkStartForm({
        businessConfigId: this.activeBusiness?.id,
        formId: id,
      })
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg)
        return
      }
      this.formContent = {
        fields,
        config,
      }
    },
    onRemoveForm() {
      this.$confirm(`此操作将解除${this.activeBusiness?.name}的启动项表单，是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning',
      })
        .then(async () => {
          const { errorInfo } = await removeStartForm({
            businessConfigId: this.activeBusiness?.id,
          })
          if (errorInfo.errorCode) {
            this.$message.error(errorInfo.errorMsg)
            return
          }
          this.formContent = {}
        })
        .catch(() => {})
    },
    async fetchStartFrom() {
      const { errorInfo, result } = await getSelectProcessStartForm({
        businessConfigId: this.activeBusiness?.id,
      })
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg)
        return
      }
      if (!result) {
        this.formContent = {}
        return
      }
      this.formContent = this.disableForm(result).formContent
    },
    async fetchFormList() {
      const { errorInfo, result: formList = [] } = await designFormDesignServiceAll({
        status: 'enabled',
        tenantId: this.tenantId,
        ascription: this.businessData[0]?.code,
        business: this.activeBusiness?.code,
        name: this.formName,
      })
      if (errorInfo.errorCode) {
        this.$message.error(errorInfo.errorMsg)
      }
      this.formList = formList.map(this.disableForm)
    },
    disableForm(form) {
      const newForm = { ...form }
      newForm.formContent = JSON.parse(newForm.content)
      newForm.formContent.fields = newForm.formContent.list
      newForm.formContent.config && (newForm.formContent.config.disabled = true)
      return newForm
    },
  },
}
</script>

<style lang="scss">
.preview-popper {
  max-height: 500px;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>

<style scoped lang="scss">
.btn-custom-cancel {
  float: right;
  margin-left: 10px;
}

.start_container {
  display: flex;

  ::-webkit-scrollbar {
    display: none;
  }
}

.start_right {
  width: 80%;
  padding: 10px;
  margin-left: 20px;
  border: 1px solid rgb(204, 204, 204);
  display: flex;
}

.start_right button {
  margin-top: 20px;
}

.start_left {
  padding-left: 20px;
  width: 300px;
  border: 1px solid rgb(204, 204, 204);
}

.form-preview {
  flex-grow: 1;
  margin: 20px 0px 0px 20px;
  display: flex;
  flex-direction: column;
  color: $font-color;

  .title {
    line-height: 40px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .content-wrapper {
    flex-grow: 1;
    padding: 20px 30px;
    overflow: auto;
    border: 1px solid $border-color;
  }
}

.remove-button {
  @include resetBtn;
}

.form-list-wrapper {
  width: 468px;
  height: 680px;
  padding: 0 38px;

  .title {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
  }

  .search-form {
    margin-top: 25px;
  }

  .content-wrapper {
    height: 580px;
    overflow: scroll;
    margin: 10px 0;

    & > div {
      border: 1px solid $border-color;
      background-color: $card-bg-color-1;
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 6px 20px;
      font-size: 14px;

      .info {
        display: flex;
        flex-direction: row;
        color: #999999;

        & > div:first-child {
          width: 150px;
        }
      }

      .operations {
        display: flex;
        flex-direction: row;
      }
    }
  }
}

.preview-button {
  margin-right: 20px;
  color: #0199f3;
  cursor: pointer;
}

.link-button {
  color: #0dd5ef;
  cursor: pointer;
}
</style>
