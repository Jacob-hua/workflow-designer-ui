<template>
  <div>
    <el-form-item label="关联">
      <el-switch v-model="currentField.needDepend"></el-switch>
    </el-form-item>
    <template v-if="currentField.needDepend">
      <div class="depend-wrapper">
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
      </div>
      <el-form-item v-if="isFormDepend" label="采用显示文本">
        <el-switch @change="handleChangeWithLabel" v-model="dependValue.withLabel"></el-switch>
      </el-form-item>
      <el-form-item v-if="isFormDepend" label="自定义显示">
        <el-switch @change="handleChangeCustomize" v-model="dependValue.customize"></el-switch>
      </el-form-item>
      <el-form-item v-if="dependValue.customize" label="目标字段">
        <el-input v-model="dependValue.targetField" />
      </el-form-item>
      <el-form-item v-if="needTargetValue" label="目标值">
        <el-input v-model="dependValue.targetValue" />
      </el-form-item>
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
    needTargetValue: {
      type: Boolean,
      default: false,
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
  computed: {
    isFormDepend() {
      return this.dependValue && this.dependValue.sourceType === 'form'
    },
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
    handleChangeCustomize(val) {
      if(val){
        this.dependValue.withLabel = false;
      }else {
        delete this.dependValue.targetField; 
      }
    },
    handleChangeWithLabel(val){
      if(val) {
        this.dependValue.customize = false;
        delete this.dependValue.targetField;
      }
    }
  },
}
</script>

<style scoped lang="scss">
.depend-wrapper {
  margin-top: 10px;
  margin-bottom: 10px;
  color: white;
}
</style>
