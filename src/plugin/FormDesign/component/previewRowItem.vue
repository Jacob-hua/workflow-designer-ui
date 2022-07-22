<template>
  <el-col>
    <el-row v-if="model.controlFiledFlag" @mouseenter.native='move' @mouseleave.native='leave' class="rows" :gutter="model.gutter">
      <i @click="addComponent(model)" v-show="iconFlag"
         class="copy el-icon-circle-plus-outline"></i>
      <i @click="delComponent(model)" v-show="iconFlag && index !== firstIndex"
         class="del el-icon-remove-outline"></i>
      <div class="drag-wrapper">
         <slot></slot>
      </div>
    </el-row>
  </el-col>
</template>
<script>

export default {
  name: "previewRowItem",
  components: {},
  props: ['model', 'value', "itemList", 'index', 'controlFiled'],
  data() {
    return {
      iconFlag: false,
      firstIndex: null
    }
  },
  watch: {
    model: {
      immediate: true,
      deep: true,
      handler(data) {
        data.controlFiledFlag = true
      }
    }
  },
  computed: {},
  mounted() {
    console.log(this.model.controlFiledFlag =  true)
    this.firstIndex = this.itemList.map(element => element.compType).indexOf('row')
  },
  methods: {
    addComponent(model) {
      this.$emit('changeItemList', model)
    },
    delComponent(data) {
      this.itemList.splice(this.itemList.findIndex((item) => item.id === data.id), 1)
    },
    move() {
      this.iconFlag = true
    },
    leave() {
      this.iconFlag = false
    }
  }
}
</script>
<style scoped lang="scss">
.del {
  cursor: pointer;
  font-size: 30px !important;
  color: red;
  margin-left: 10px;
  position: absolute;
  right: 0;
  top: -30px;
}

.rows:hover {
  border: 1px dashed #fff;
  padding-top: 20px;
}

.copy {
  position: absolute;
  right: 40px;
  top: -30px;
  cursor: pointer;
  font-size: 30px !important;
  color: #409eff;
  margin-left: 10px;
}
</style>