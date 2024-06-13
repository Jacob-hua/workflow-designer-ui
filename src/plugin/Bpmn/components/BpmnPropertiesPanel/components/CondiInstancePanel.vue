<template>
    <div class="config-st-at">
      <el-form :model="condInstance" label-position="right" label-width="130px">
        <el-form-item label="判断类型">
          <el-select v-model="condInstance.typeSt" @change="handlerToChange">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="完成设置" v-if="condInstance.typeSt === 'passPerson'">
            <!-- <el-input v-model="condInstance.passPerson" placeholder="请输入"  @change="handlerToChangePerson" /> -->
            <el-input-number class="stt-att" v-model="condInstance.passPerson" :precision="0" :step="1" :min="0" :max="1000" @change="handlerToChangePerson"></el-input-number>
        </el-form-item>
        <el-form-item label="完成条件" v-if="condInstance.typeSt === 'passPercent'">
            <!-- <el-input v-model="condInstance.passPercent" placeholder="请输入"  @change="handlerToChangePercent"> -->
            <el-input-number v-model="condInstance.passPercent" :precision="0" :step="1" :min="0" :max="100" @change="handlerToChangePercent"></el-input-number>
            <span style="margin-left: 5px; color: #fff">%</span>
            <!-- </el-input> -->
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  import { deepCopy, deepEquals, emptyPropertiesObject } from '../../../utils/object'
  
  export default {
    name: 'updateCondiInstance',
    props: {
      namespace: {
        type: String,
        required: true,
        default: '',
      },
    },
    data() {
      return {
        condInstance: {
            typeSt: 'nrOfInstances',
            passPerson: 0,
            passPercent: 0
        },
        options: [
            { label: '全部完成', value: 'nrOfInstances' },
            { label: '按人数通过', value: 'passPerson' },
            { label: '按比例通过', value: 'passPercent' }
        ]
      }
    },
    computed: {
      condiInstanceSt() {
        return this.$store.state[this.namespace].panel.condiInstance
      },
    },
    watch: {
      condiInstanceSt: {
        immediate: true,
        handler(value) {
          this.changeDomStyle()
          this.condInstance = { ...this.condiInstanceSt }
        },
      },
    },
    mounted() {
      // this.changeDomStyle()
    },
    methods: {
      changeDomStyle() {
        this.$nextTick(() => {
          const dom1 = document.getElementsByClassName('el-input-number__decrease')[0]
          const dom2 = document.getElementsByClassName('el-input-number__increase')[0]
          // console.log(dom1, dom2)
          if (dom1) {
            dom1.style.background = '#212739'
          }
          if (dom2) {
            dom2.style.background = '#212739'
          }
        })
      },
      handlerToChange() {
          this.updateCondiInstance()
          this.changeDomStyle()
      },
      handlerToChangePerson() {
          this.updateCondiInstance()
      },
      handlerToChangePercent() {
          this.updateCondiInstance()
      },
      updateCondiInstance() {
          this.$store.commit(`${this.namespace}/panel/updateCondiInstance`, this.condInstance)
      }
    },
  }
  </script>
  
  <style scoped lang="scss">
  @import '../index.scss';
  :deep(.el-input-number__decrease) {
    background-color: #212739 !important;
  }
  :deep(.el-input-number__increase) {
    background-color: #212739 !important;
  }
  </style>
  