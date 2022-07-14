<template>
  <el-col>
    <el-row @mouseenter.native='move' @mouseleave.native='leave' class="rows" :gutter="model.gutter">
      <i @click="addComponent(model)" v-show="iconFlag && index === firstIndex"
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
import _ from 'lodash'
import {getSimpleId} from "@/plugin/FormDesign/utils/IdGenerate";

export default {
  name: "previewRowItem",
  components: {},
  props: ['model', 'value', "itemList", 'index'],
  data() {
    return {
      iconFlag: false,
      firstIndex: null
    }
  },
  computed: {},
  mounted() {
    this.firstIndex = this.itemList.map(element => element.compType).indexOf('row')
  },
  methods: {
    addComponent(model, position = '001') {
      const clone = JSON.parse(JSON.stringify(model))
      const uId = "row_"+getSimpleId();
      clone.id = uId;
      clone._id = uId;
      clone.columns.map((column)=>{
        let itemList = [];
        column.list.map((item,i)=>{
          const cloneitem = JSON.parse(JSON.stringify(item))
          const uId = "fd_"+getSimpleId();
          cloneitem.id = uId;
          cloneitem._id = uId;
          itemList.push(cloneitem);
        })
        column.list = [];
        column.list = itemList;
      })
      this.itemList.push(clone);
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
  right: 0;
  top: -30px;
  cursor: pointer;
  font-size: 30px !important;
  color: #409eff;
  margin-left: 10px;
}
</style>