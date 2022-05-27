<template>
  <div>
    <el-table :data="listeners"
              size="mini"
              border>
      <el-table-column label="序号"
                       width="50px"
                       type="index" />
      <el-table-column label="事件类型"
                       min-width="80px"
                       show-overflow-tooltip
                       prop="eventType"
                       :formatter="eventTypeLabel" />
      <el-table-column label="监听器类型"
                       min-width="80px"
                       show-overflow-tooltip
                       prop="listenerType"
                       :formatter="listenerTypeLabel" />
      <el-table-column label="操作"
                       width="90px">
        <template slot-scope="{ row, $index }">
          <el-button size="mini"
                     type="text"
                     @click="onClickEditButton(row, $index)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button size="mini"
                     type="text"
                     style="color: #ff4d4f"
                     @click="onClickRemoveButton(row, $index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-button size="mini"
                 type="primary"
                 icon="el-icon-plus"
                 @click="onClickAddListenerButton">添加监听器</el-button>
    </div>
    <execute-listener-drawer :visible="drawerVisible"
                             :onClose="onDrawerClose" />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import ExecuteListenerDrawer from './ExecuteListenerDrawer.vue'

export default {
  name: 'executeListenerPanel',
  components: { ExecuteListenerDrawer },
  data() {
    return {
      drawerVisible: false,
    }
  },
  computed: {
    ...mapState('bpmn', ['listeners']),
    ...mapGetters('bpmn/config', ['eventTypeLabel', 'listenerTypeLabel']),
  },
  methods: {
    openDrawer() {
      this.drawerVisible = true
    },
    closeDrawer() {
      this.drawerVisible = false
    },
    onClickEditButton(row, $index) {
      console.log(row)
    },
    onClickRemoveButton(row, $index) {},
    onClickAddListenerButton() {
      this.openDrawer()
    },
    onDrawerClose() {
      this.closeDrawer()
    },
  },
}
</script>

<style>
</style>