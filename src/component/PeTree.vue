<template>
  <div class="pe-tree tree-container">
    <el-tree
      :data="data"
      class="tree"
      node-key="nodeKey"
      :indent="0"
      @node-click="nodeClick"
      :current-node-key="currentNodeKey"
    >
      <div class="custom-tree-node" slot-scope="{ data }">
        <span class="pe-tree-label">{{ data[labelName] }}</span>
      </div>
    </el-tree>
  </div>
</template>

<script>
export default {
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
  },
  data() {
    return {}
  },
  methods: {
    nodeClick(data, node) {
      this.$emit('nodeClick', data, node)
    },
  },
}
</script>

<style scoped lang="scss">
  @include tree;
</style>
