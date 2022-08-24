<template>
  <div class="pe-tree tree-container">
    <el-tree
      :data="data"
      class="tree"
      node-key="nodeKey"
      :indent="0"
      @node-click="nodeClick"
      :current-node-key="currentNodeKey"
      default-expand-all
    >
      <div class="custom-tree-node" slot-scope="{ data }">
        <long-text :content="data[labelName]" />
      </div>
    </el-tree>
  </div>
</template>

<script>
import longText from "@/component/LongText.vue";

export default {
  components: {
    longText,
  },
  props: {
    nodeKey: {
      type: String,
      default: 'groupId'
    },
    labelName: {
      type: String,
      default: 'groupName'
    },
    data: {
      type: Array,
      default: () => {
        ;[]
      },
    },
    currentNodeKey: {
      type: String,
      default: 'XM_aff0659724a54c119ac857d4e560b47b:-1:template:78',
    },
    placement: {
      type: String,
      default: 'bottom'
    },
  },
  data() {
    return {}
  },
  methods: {
    nodeClick(data, node) {
      this.$emit('nodeClick', data, node)
    },
    content(data, node){
      this.$emit('nodeClick', data, node)
    },
  },
}
</script>

<style scoped lang="scss">
.pe-tree-label {
  width: 170px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
}

  @include tree;
</style>
