<template>
  <div>
    <el-drawer :title="title" :visible="visible" @close="onCloseDrawer" append-to-body direction="rtl">
      <el-form ref="form">
        <el-form-item label="自定义">
          <el-switch v-model="custom"></el-switch>
        </el-form-item>
        <template v-if="custom">
          <el-form-item :label="title">
            <el-tag
              :key="value"
              v-for="{ value, label } in result"
              closable
              :disable-transitions="false"
              @close="onDelTag(value)"
            >
              {{ label }}
            </el-tag>
            <template v-if="inputVisible">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-input v-model="inputValue" ref="saveTagInput" size="small"> </el-input>
                </el-col>
                <el-col :span="6">
                  <el-button class="submit-button" @click="handleInputConfirm">确定</el-button>
                </el-col>
              </el-row>
            </template>
            <el-button v-else class="button-new-tag" size="small" @click="showInput" icon="el-icon-edit">{{
              newTagButton
            }}</el-button>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item v-if="organizationVisible" label="组织">
            <el-cascader
              v-model="organization"
              :options="userGroupOptions"
              :props="{
                emitPath: false,
                checkStrictly: true
              }"
              :show-all-levels="false"
              clearable
              @change="onOrganizationChange"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item v-if="usersVisible" label="人员">
            <el-select v-model="users" clearable @change="onUsersChange">
              <el-option
                v-for="{ label, value, id } in userSelectOptions"
                :key="id"
                :label="label"
                :value="value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="title">
            <el-tag v-for="{ label, value } in result" :key="value" :type="value" closable @close="onDelTag(value)">{{
              label
            }}</el-tag>
          </el-form-item>
        </template>
      </el-form>
      <div class="form-footer">
        <el-button class="submit-button" @click="onSubmit">保存</el-button>
        <el-button class="cancel-button" @click="onCancel">取消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { deepCopy } from '../../../utils/object'

export default {
  name: 'ElementUserTaskDrawer',
  props: {
    title: {
      type: String,
      default: '选择用户',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    namespace: {
      type: String,
      required: true,
      default: '',
    },
    lazyLoadUser: {
      type: Function,
      default: () => {},
    },
    model: {
      type: String,
      default: 'singleUser',
    },
    selected: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      custom: false,
      inputVisible: false,
      inputValue: '',
      organization: '',
      users: '',
      result: [],
      userSelectOptions: [],
    }
  },
  watch: {
    selected: {
      immediate: true,
      handler(selected) {
        this.result = deepCopy(selected)
      },
    },
  },
  computed: {
    userGroupOptions() {
      return this.$store.state[this.namespace].config.userGroupOptions
    },
    userTask() {
      return this.$store.state[this.namespace].panel.userTask
    },
    organizationVisible() {
      return ['singleUser', 'multipleUser', 'multipleOrganization'].includes(this.model)
    },
    usersVisible() {
      return ['singleUser', 'multipleUser'].includes(this.model)
    },
    newTagButton() {
      if (this.model === 'singleUser' && this.result.length > 0) {
        return '修改'
      }
      return '新增'
    },
  },
  methods: {
    onCloseDrawer() {
      this.$emit('close')
      this.$emit('update:visible', false)
      this.result = []
      this.organization = ''
      this.users = ''
      this.custom = false
    },
    onOrganizationChange(organize) {
      if (['multipleOrganization'].includes(this.model)) {
        const findeOrganize = (organizes, target) => {
          for (let index = 0; index < organizes.length; index++) {
            const organize = organizes[index]
            if (target === organize.value) {
              return organize
            }
            if (Array.isArray(organize.children)) {
              return findeOrganize(organize.children, target)
            }
          }
        }
        this.addResult(findeOrganize(this.userGroupOptions, this.organization))
        return
      }
      if (Array.isArray(organize)) {
        organize = organize[organize.length - 1]
      }
      Promise.resolve(this.lazyLoadUser({ value: organize })).then((res) => {
        this.users = []
        this.userSelectOptions = res
      })
    },
    onUsersChange(users) {
      if (Array.isArray(users)) {
        users.forEach((user) => {
          this.addResult(this.findSelectUserOption(user))
        })
        return
      }
      this.addResult(this.findSelectUserOption(users))
    },
    onDelTag(tag) {
      this.result.splice(
        this.result.findIndex(({ value }) => value === tag),
        1
      )
      this.users = ''
    },
    showInput() {
      this.inputVisible = true
      if (this.newTagButton === '修改') {
        this.inputValue = this.result[0]?.value
        this.result = []
      }
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.addResult({ value: inputValue, label: inputValue })
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    onSubmit() {
      this.$emit('submit', deepCopy(this.result))
      this.onCloseDrawer()
    },
    onCancel() {
      this.onCloseDrawer()
    },
    findSelectUserOption(user) {
      return this.userSelectOptions.find(({ value }) => value == user)
    },
    addResult({ value, label }) {
      if (['singleUser'].includes(this.model)) {
        this.result.splice(0, this.result.length, { value, label })
        return
      }
      let index = this.result.findIndex(({ value: tag }) => tag === value)
      if (index !== -1) {
        return
      }
      this.result.splice(this.result.length - 1, 0, { value, label })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../index.scss';

/deep/ .el-dialog {
  @include formDialog;
}

.form-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 50px 0;
}

.submit-button {
  @include primaryBtn;
}

.cancel-button {
  @include cancelBtn;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
