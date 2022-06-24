<template>
  <el-dialog :title="title" :visible="visible" :before-close="onCancel" @open="onOpen" width="70%" append-to-body>
    <div class="people">
      <div>
        <span>组织结构</span>
      </div>
      <div class="people-main">
        <div class="people-main-left">
          <el-tree
            :data="treeData"
            node-key="groupId"
            :current-node-key="currentKey"
            @current-change="onTreeSelectedChange"
            :highlight-current="true"
            :props="{ label: 'groupName', children: 'children' }"
          ></el-tree>
        </div>
        <div class="people-main-right">
          <div class="people-main-right-search">
            <el-input
              v-model="userName"
              placeholder="请输入姓名搜索人员"
              prefix-icon="el-icon-search"
              @keyup.enter.native="getPeopleList"
            ></el-input>
          </div>
          <div class="people-main-right-table">
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              row-key="userId"
              style="width: 100%"
              @select="onSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center" :reserve-selection="true"> </el-table-column>
              <el-table-column label="序号" type="index" align="center"> </el-table-column>
              <el-table-column prop="lastName" label="姓名" align="center"> </el-table-column>
              <el-table-column prop="userId" label="账号" show-overflow-tooltip align="center"> </el-table-column>
              <el-table-column prop="email" label="邮箱" show-overflow-tooltip align="center"> </el-table-column>
            </el-table>
          </div>
          <div class="people-main-right-page">
            <el-pagination
              @current-change="fetchPeopleList"
              :current-page.sync="getData.page"
              :page-size="getData.limit"
              layout="prev, pager, next, jumper"
              :total="getData.total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <div>
        <span>指定人员</span>
      </div>
      <div class="people-footer">
        <div class="peopleList">
          <div class="peopleList-item" v-for="(item, index) in multipleSelection" :key="index">
            {{ item.userId }} <i class="el-icon-remove-outline" @click="onDeletePeople(index)"></i>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancel"> 取 消 </el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getPersonUser, getThreeSystemOrganize } from '@/api/unit/api.js'
import { mapState } from 'vuex'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '标题',
    },
  },
  data() {
    return {
      userName: '',
      multipleSelection: [],
      currentKey: '',
      getData: {
        groupId: '',
        name: '',
        tenantId: this.tenantId,
        limit: 5,
        page: 1,
        total: 1,
      },
      tableData: [],
      treeData: [],
    }
  },
  computed: {
    ...mapState('account', ['userInfo', 'tenantId', 'currentOrganization']),
  },
  watch: {
    selected(selected) {
      this.multipleSelection = JSON.parse(JSON.stringify(selected))
    },
    tableData(tableData) {
      tableData.forEach((row) => {
        const targetIndex = this.multipleSelection.findIndex(({ userId }) => userId === row.userId)
        if (targetIndex !== -1) {
          this.multipleSelection.splice(targetIndex, 1, row)
        }
      })
    },
    multipleSelection(multipleSelection) {
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection()
        multipleSelection.forEach((item) => {
          this.$refs.multipleTable.toggleRowSelection(item, true)
        })
      })
    },
  },
  methods: {
    onOpen() {
      this.fetchTreeData()
    },
    onSelectionChange(_, row) {
      const targetIndex = this.multipleSelection.findIndex(({ userId }) => row.userId === userId)
      if (targetIndex === -1) {
        this.multipleSelection.push(row)
      } else {
        this.multipleSelection.splice(targetIndex, 1)
      }
    },
    onCancel() {
      this.dialogVisible = false
      this.$emit('update:visible', false)
    },
    onTreeSelectedChange(key) {
      this.currentKey = key.groupId
      this.fetchPeopleList()
    },
    onDeletePeople(index) {
      this.multipleSelection.splice(index, 1)
    },
    onSubmit() {
      const removeds = this.selected.reduce((removeds, item) => {
        if (!this.multipleSelection.find(({ userId }) => userId === item.userId)) {
          removeds.push({ ...item })
        }
        return removeds
      }, [])
      const addeds = this.multipleSelection.reduce((addeds, item) => {
        if (!this.selected.find(({ userId }) => userId === item.userId)) {
          addeds.push({ ...item })
        }
        return addeds
      }, [])
      this.$emit('submit', { removeds, addeds, selections: this.multipleSelection })
      this.$emit('update:visible', false)
    },
    async fetchPeopleList() {
      try {
        const { errorInfo, result } = await getPersonUser({
          ...this.getData,
          groupId: this.currentKey,
          name: this.userName,
        })
        if (errorInfo.errorCode) {
          return
        }
        this.tableData = result.list
        this.getData.total = result.total * 1
      } catch (error) {}
    },
    async fetchTreeData() {
      try {
        const { errorInfo, result = [] } = await getThreeSystemOrganize({
          projectCode: this.currentOrganization,
        })
        if (errorInfo.errorCode) {
          return
        }
        this.treeData = result
        this.currentKey = result[0]?.groupId
        this.fetchPeopleList()
      } catch (error) {}
    },
  },
}
</script>

<style scoped="scoped">
.people-main {
  display: flex;
}

.people-main-left {
  flex: 3;
  height: 480px;
  background-color: #f3f3f3;
  overflow: auto;
  padding: 20px 10px;
}

::v-deep .el-tree {
  background-color: transparent;
}

::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #c2f5f5;
}

.people-main-right {
  flex: 7;
  height: 480px;
  background-color: #f3f3f3;
  margin-left: 10px;
  padding: 20px 10px;
}

.people-main-right-search /deep/ .el-input .el-input__inner {
  border-radius: 40px;
  border: 1px solid #000000;
  color: black;
}

::v-deep .el-tabs__item {
  padding: 0px 23px 0px 0px;
}

.people-main-right-page {
  margin-top: 20px;
  text-align: right;
}

.people-footer {
  height: 180px;
  background-color: #f3f3f3;
  padding: 20px;
  color: black;
}

.peopleList {
  display: flex;
  margin-top: 15px;
}

.peopleList-item {
  width: 96px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border: 1px solid #108cee;
  border-radius: 5px;
  margin-right: 20px;
}
.people-footer .el-icon-remove-outline {
  color: #2f9aef;
  font-size: 16px;
}

.people-main-right-table {
  margin-top: 40px;
}
</style>
