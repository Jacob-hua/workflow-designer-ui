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
        <template slot-scope="{ $index }">
          <el-button size="mini"
                     type="text"
                     @click="onClickEditButton($index)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button size="mini"
                     type="text"
                     style="color: #ff4d4f"
                     @click="onClickRemoveButton($index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-button size="mini"
                 type="primary"
                 icon="el-icon-plus"
                 @click="onClickAddListenerButton">添加监听器</el-button>
    </div>
    <execute-listener-drawer :listener="listener"
                             :visible="drawerVisible"
                             :onClose="onDrawerClose"
                             :onSubmit="onDrawerSubmit" />
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import ExecuteListenerDrawer from './ExecuteListenerDrawer.vue'
import { isEmptyArray } from '../../../utils/array'

export default {
  name: 'executeListenerPanel',
  components: { ExecuteListenerDrawer },
  data() {
    return {
      drawerVisible: false,
      listener: {},
    }
  },
  computed: {
    ...mapState('bpmn', ['listeners']),
    ...mapGetters('bpmn/config', ['eventTypeLabel', 'listenerTypeLabel']),
    ...mapGetters('bpmn', ['findListenerByIndex']),
  },
  methods: {
    ...mapMutations('bpmn', [
      'updateListener',
      'addListener',
      'removeListener',
    ]),
    onClickEditButton(index) {
      this.editIndex = index
      this.listener = this.findListenerByIndex(index)
      this.drawerVisible = true
    },
    onClickRemoveButton(index) {
      this.removeListener({ index })
    },
    onClickAddListenerButton() {
      this.drawerVisible = true
    },
    onDrawerClose() {
      this.listener = {}
      this.drawerVisible = false
    },
    onDrawerSubmit(listener) {
      if (isEmptyArray(Object.keys(this.listener))) {
        this.addListener({ listener })
      } else {
        this.updateListener({
          index: this.editIndex,
          newListener: listener,
        })
      }
    },
  },
}
</script>

<style>
</style>