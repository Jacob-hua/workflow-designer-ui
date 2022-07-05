<template>
  <div>
    <div class="title-wrapper">
      <div class="title-mark"></div>
      <span> 执行监听器 </span>
      <el-button type="primary" @click="onAddListener">添加监听器</el-button>
    </div>
    <el-table :data="listeners" size="mini" border>
      <el-table-column label="序号" width="50px" type="index" />
      <el-table-column label="事件类型" min-width="80px" show-overflow-tooltip prop="event" :formatter="eventLabel" />
      <el-table-column
        label="监听器类型"
        min-width="80px"
        show-overflow-tooltip
        prop="listenerType"
        :formatter="listenerTypeLabel"
      />
      <el-table-column label="操作" width="90px">
        <template slot-scope="{ $index }">
          <el-button size="mini" type="text" @click="onEditListener($index)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button size="mini" type="text" style="color: #ff4d4f" @click="onRemoveListener($index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <execute-listener-drawer
      title="执行监听器"
      :listener="listener"
      :visible="drawerVisible"
      :onClose="onDrawerClose"
      :onSubmit="onDrawerSubmit"
    />
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import ExecuteListenerDrawer from './ExecuteListenerDrawer.vue'

export default {
  name: 'ExecuteListenerPanel',
  components: { ExecuteListenerDrawer },
  data() {
    return {
      drawerVisible: false,
      editIndex: null,
      defaultListener: {
        event: '',
        listenerType: '',
        expression: '',
        class: '',
        delegateExpression: '',
        scriptType: '',
        scriptFormat: '',
        scriptValue: '',
        scriptResource: '',
        fields: [],
      },
      listener: this.defaultListener,
    }
  },
  computed: {
    ...mapState('bpmn/panel', ['listeners']),
    ...mapGetters('bpmn/config', ['eventLabel', 'listenerTypeLabel']),
    ...mapGetters('bpmn/panel', ['findListenerByIndex']),
  },
  methods: {
    ...mapMutations('bpmn/panel', ['updateListener', 'addListener', 'removeListener']),
    onEditListener(index) {
      this.editIndex = index
      this.listener = this.findListenerByIndex(index)
      this.drawerVisible = true
    },
    onRemoveListener(index) {
      this.removeListener({ index })
    },
    onAddListener() {
      this.drawerVisible = true
      this.editIndex = null
    },
    onDrawerClose() {
      this.listener = this.defaultListener
      this.drawerVisible = false
    },
    onDrawerSubmit(listener) {
      if (this.editIndex === null) {
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

<style lang="scss" scoped>
$title-color: #999999 !default;

.title-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: $title-color;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  margin-bottom: 10px;

  .title-mark {
    display: inline-block;
    width: 2px;
    height: 16px;
    background: $button-submit-bg-color;
    margin-right: 6px;
  }

  & > button {
    width: 80px;
    height: 24px;
    background: transparent;
    margin-left: 8px;
    font-size: 12px;
    text-align: center;
    padding: 0;
    color: $button-submit-bg-color;
  }
}
</style>
