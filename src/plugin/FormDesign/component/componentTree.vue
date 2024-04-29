<template>
  <el-dialog width="70%" append-to-body title="组件树" :visible.sync="visible" :close-on-press-escape="false">
    <el-tree
        :data="data"
        node-key="id"
        default-expand-all
        draggable
        :props="defaultProps"
        :allow-drop="allowDrop"
        :allow-drag="allowDrag">
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="opens">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
       default: []
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'columns',
        label: 'id'
      },

    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    opens() {
      this.$emit('update:visible', false)
      let json = {};
      json.config = this.formConf;
      json.list = this.treeData2json(this.data) ;
      let jsonStr =  JSON.stringify(json, null, 4);
      this.$emit("updateJSON", jsonStr);
    },
    treeData2json(data) {
      return data.map(list => {
        if (list.compType === 'row') {
          list.columns = list.columns.map((column,index) =>{
            this.treeData2json(column.columns)
            return {
              id: index,
              list: column.columns,
              index: column.index,
              span: column.span
            }
          })
        }
        return list
      })
    },
    json2TreeData(data) {
      return data.map(list => {
        if (list.compType === 'row') {
          list.columns = list.columns.map((column,index) =>{
            this.json2TreeData(column.list)
            return {
              id: index,
              columns: column.list,
              index: column.index,
              span: column.span
            }
          })
        }
        return list
      })
    },

    allowDrop(draggingNode, dropNode, type) {

      if ( ( dropNode.data.index % 1 === 0 )  && ( type === 'prev' || type === 'next' ) ) {
        return  false
      }
      if (draggingNode.parent.data.compType === 'row' && draggingNode.data.columns) {
        return false
      }
      return !(draggingNode.level === dropNode.level && draggingNode.data.compType !== 'row' && type === 'inner');

    },
    allowDrag(draggingNode) {
      return true
    },
  }
}
</script>

<style lang="scss"> </style>