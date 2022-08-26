<template>
  <el-dialog
    :title="title"
    :visible="visible"
    :before-close="onCancel"
    :close-on-click-modal="false"
    @open="onOpen"
    top="1vh"
    fullscreen
    append-to-body
  >
    <div class="container">
      <div class="organization-wrapper">
        <div>
          <el-card header="组织结构">
            <el-tree
              :data="treeData"
              node-key="groupId"
              :current-node-key="currentKey"
              @current-change="onTreeSelectedChange"
              :highlight-current="true"
              :props="{ label: 'groupName', children: 'children' }"
            ></el-tree>
          </el-card>
        </div>
        <div>
          <div class="user-select-wrapper">
            <el-input
              v-model="userName"
              placeholder="请输入姓名搜索人员"
              prefix-icon="el-icon-search"
              @keyup.enter.native="getPeopleList"
            ></el-input>
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              row-key="userId"
              style="width: 100%"
              @select="onSelectionChange"
              @select-all="onSelectionAll"
            >
              <el-table-column type="selection" width="55" align="center" :reserve-selection="true"> </el-table-column>
              <el-table-column label="序号" type="index" align="center"> </el-table-column>
              <el-table-column prop="lastName" label="姓名" align="center"> </el-table-column>
              <el-table-column prop="userId" label="账号" show-overflow-tooltip align="center"> </el-table-column>
              <el-table-column prop="email" label="邮箱" show-overflow-tooltip align="center"> </el-table-column>
            </el-table>
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
      <div class="user-wrapper">
        <div class="title">已选择人员</div>
        <div class="users">
          <div class="users-item" v-for="(item, index) in multipleSelection" :key="index">
          <long-text contentStyle="width: 80px" :content="item.userId" />
          <i class="el-icon-remove-outline" @click="onDeletePeople(index)"></i>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer">
      <el-button class="submit-button" @click="onSubmit">确 定</el-button>
      <el-button class="cancel-button" @click="onCancel"> 取 消 </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getPersonUser, getThreeSystemOrganize } from '@/api/unit/api.js'
import { mapState } from 'vuex'
import longText from "@/component/LongText.vue"

export default {
  components: {
    longText,
  },
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
    isRadio: {
      type: Boolean,
      default: false,
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
        limit: 10,
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
    onSelectionAll() {
      if (this.isRadio) {
        this.multipleSelection = []
      }
    },
    onSelectionChange(_, row) {
      const targetIndex = this.multipleSelection.findIndex(({ userId }) => row.userId === userId)
      if (this.isRadio) {
        this.multipleSelection = targetIndex !== -1 ? [] : [row]
        return
      }
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

<style scoped lang="scss">
.el-card {
  height: 100%;
}

.submit-button {
  @include primaryBtn;
}

.cancel-button {
  @include cancelBtn;
}

.container {
  display: flex;
  flex-direction: column;

  & > div:first-child {
    flex: 1;
    margin-bottom: 20px;
  }
}

.organization-wrapper {
  display: flex;
  flex-direction: row;

  & > div:first-child {
    width: 350px;
  }

  & > div:last-child {
    flex: 1;
  }
}

.user-select-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 20px;
  border: 1px solid $border-color-1;
  border-radius: 4px;
  padding: 20px;
  box-sizing: border-box;

  .el-table {
    margin-top: 20px;
  }

  .el-pagination {
    text-align: right;
    padding-top: 20px;
  }
}

.user-wrapper {
  height: 150px;
  border: 1px solid $border-color-1;
  border-radius: 4px;

  .title {
    color: $font-color;
    font-size: 15px;
    line-height: 20px;
    font-weight: 400;
    padding: 18px 20px;
    border-bottom: 1px solid $border-color-1;
    background: $card-bg-color-1;
  }
}

.users {
  display: flex;
  margin-top: 15px;
  color: $font-color;
  padding: 18px 20px;
}

.users-item {
  width: 100px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  border: 1px solid $button-submit-bg-color;
  border-radius: 5px;
  margin-right: 20px;
  cursor: pointer;
}
</style>
