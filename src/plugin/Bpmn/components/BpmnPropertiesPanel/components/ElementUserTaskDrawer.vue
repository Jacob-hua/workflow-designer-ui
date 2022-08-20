<template>
  <div>
    <el-drawer :title="title" :visible="visible" @close="onCloseDrawer" append-to-body direction="rtl">
      <el-form ref="form">
        <el-form-item v-if="organizationVisible" label="组织">
          <el-cascader
            v-model="organization"
            :options="userGroupOptions"
            :props="organizeCascaderProps"
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
        <el-form-item v-if="usersVisible" label="选中">
          <el-tag v-for="{ label, value } in result" :key="value" :type="value" closable @close="onDelTag(value)">{{
            label
          }}</el-tag>
        </el-form-item>
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

function requiredRule(message) {
  return [{ required: true, trigger: ['change'], message }]
}

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
    custom: {
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
  },
  data() {
    return {
      organization: [],
      users: '',
      result: [],
      formRules: {
        organization: [...requiredRule('请选择组织')],
        users: [...requiredRule('请选择用户')],
      },
      userSelectOptions: [],
    }
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
    organizeCascaderProps() {
      return {
        emitPath: false,
        multiple: ['multipleOrganization'].includes(this.model),
      }
    },
    usersVisible() {
      return ['singleUser', 'multipleUser'].includes(this.model)
    },
  },
  methods: {
    onCloseDrawer() {
      this.$emit('close')
      this.$emit('update:visible', false)
      this.result = []
      this.organization = []
      this.users = ''
    },
    onOrganizationChange(organize) {
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
    onSubmit() {
      if (['multipleOrganization'].includes(this.model)) {
        const findeOrganize = (organizes, targets, result = []) => {
          for (let index = 0; index < organizes.length; index++) {
            const organize = organizes[index]
            if (Array.isArray(organize.children)) {
              findeOrganize(organize.children, targets, result)
            }
            if (targets.includes(organize.value)) {
              result.push(organize)
            }
          }
        }
        findeOrganize(this.userGroupOptions, this.organization, this.result)
      }
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
