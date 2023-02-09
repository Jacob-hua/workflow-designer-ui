<template>
  <el-select
    v-model="selectAddress"
    filterable
    clearable
    remote
    reserve-keyword
    :remote-method="fetchAddress"
    :multiple="multiple"
    :disabled="disabled"
    :placeholder="placeholder"
    @change="onSelectChange"
  >
    <el-option v-for="(item, index) in options" :key="index" :label="item.name" :value="item.location">
      <span style="float: left">{{ item.name }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.district }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { queryAddressInfo } from '@/api/unit/api.js'

export default {
  name: 'amap',
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selectAddress: this.$props.value.name,
      options: [],
      selectValue: this.$props.value,
    }
  },
  methods: {
    onSelectChange(value) {
      this.selectValue = this.options.find(({ location }) => location === value)
      this.$emit('input', this.selectValue)
    },
    async fetchAddress(key) {
      try {
        const { errorInfo, result } = await queryAddressInfo({
          address: key,
        })
        if (errorInfo.errorCode) {
          this.$message.error(errorInfo.errorMsg)
        }
        if (!Array.isArray(result)) {
          return
        }
        this.options = result.reduce(
          (options, { name, district, address, location }) => [
            ...options,
            {
              name: `${district} ${address} ${name}`,
              district,
              location,
            },
          ],
          []
        )
      } catch (error) {
        this.options = []
      }
    },
  },
}
</script>
