<template>
  <div>
    <el-form-item label="关联">
      <el-switch v-model="currentField.needDepend"></el-switch>
    </el-form-item>
    <template v-if="currentField.needDepend">
      <el-row :gutter="24">
        <el-col :span="16"> 关联 </el-col>
        <el-col :span="8"> 类型 </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="16">
          <el-input v-model="dependValue.source" />
        </el-col>
        <el-col :span="8">
          <el-select v-model="dependValue['sourceType']" @change="onSourceTypeChange">
            <el-option
              v-for="{ id, label, value } in sourceTypeOptions"
              :key="id"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script>
export default {
  name: 'DependValue',
  props: {
    currentField: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      sourceTypeOptions: [
        {
          id: 0,
          label: '常量',
          value: 'const',
        },
        {
          id: 1,
          label: '环境变量',
          value: 'context',
        },
        {
          id: 2,
          label: '表单',
          value: 'form',
        },
      ],
      dependValue: {
        sourceType: 'const',
        source: '',
      },
    }
  },
  watch: {
    currentField: {
      immediate: true,
      handler(currentField) {
        if (!currentField || !currentField.dependValue) {
          return
        }
        this.dependValue = currentField.dependValue
      },
    },
    dependValue: {
      deep: true,
      handler(dependValue) {
        this.$emit('dependChange', { ...dependValue })
      },
    },
    'currentField.needDepend': {
      handler(needDepend) {
        if (needDepend) {
          this.$emit('dependChange', { ...this.dependValue })
        } else {
          delete this.currentField.dependValue
        }
      },
    },
  },
  methods: {
    onSourceTypeChange() {
      this.dependValue.source = ''
    },
  },
}
</script>
