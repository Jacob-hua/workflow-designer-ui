<template>
  <div class="dictionary-management-inner">
    <el-form :inline="true" :model="formData" class="search-wrapper" size="mini">
      <el-form-item label="枚举名称">
        <el-input v-model="formData.name" placeholder="枚举名称"></el-input>
      </el-form-item>
      <el-form-item label="枚举code">
        <el-input v-model="formData.code" placeholder="枚举code"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onAdd">新增枚举</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <i class="el-icon-close" style="font-size: 20px; color: #fff;cursor: pointer" @click="handlerToCloseDom"></i>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      height="750px"
      style="width: 100%">
      <el-table-column
        label="枚举名称">
        <template slot-scope="scope">
          <!-- {{ scope.row.name }} -->
          <el-tooltip :content="scope.row.name" :open-delay="500" placement="top">
            <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ scope.row.name }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="枚举code">
        <template slot-scope="scope">
          <!-- {{ scope.row.name }} -->
          <el-tooltip :content="scope.row.code" :open-delay="500" placement="top">
            <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ scope.row.code }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        width="300"
        label="枚举描述">
        <template slot-scope="scope">
          <!-- {{ scope.row.name }} -->
          <el-tooltip :content="scope.row.remark" :open-delay="500" placement="top">
            <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ scope.row.remark }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="sortNum"
        label="排序">
      </el-table-column>
      <el-table-column
        prop="creatorName"
        label="添加人">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="添加时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="float:right; margin-top: 10px;"
      layout="prev, pager, next"
      :page-size="page.pageSize"
      @current-change="handleCurrentChange"
      :total="page.total">
    </el-pagination>
    <div style="position: fixed; z-index: 9999">
      <AddEnum ref="addEnum" @addOne="addOne" />
      <EditEnum ref="editEnum" @update="update" />
    </div>
  </div>
</template>

<script>
import { getDictionaryItemEnum, addEnumItem, editEnumItem, deleteEnumItem } from '@/api/systemManagement.js'
import AddEnum from './addEnum.vue'
import EditEnum from './editEnum.vue'
export default {
  components: {
    AddEnum,
    EditEnum
  },
  data() {
    return {
      parentData: {},
      formData: {
        name: '',
        code: ''
      },
      options: [],
      tableData: [],
      page: {
        pageNumber: 1,
        pageSize: 12,
        total: 20
      }
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    getParentData(data) {
      this.parentData = data
    },
    async _getDictionaryItemEnum(params) {
      const result = await getDictionaryItemEnum(params).catch(err => {
        this.$message.error(err.msg)
      })
      if (result?.code === '200') {
        this.tableData = result.data.dataList
        this.page.total = Number(result.data.total)
      }
    },
    async _addEnumItem(params) {
      const result = await addEnumItem(params).catch(err => {
        this.$message.error(err.msg)
      })
      if (result?.code === '200') {
        this._getDictionaryItemEnum({
          code: this.formData.code,
          limit: this.page.pageSize,
          page: this.page.pageNumber,
          name: this.formData.name,
          parentCode: this.parentData.code
        })
        this.$refs.addEnum.dialogVisible = false;
      } else {
        this.$message.error(result.msg)
      }
    },
    async _editEnumItem(params) {
      const result = await editEnumItem(params).catch(err => {
        this.$message.error(err.msg)
      })
      if (result?.code === '200') {
        this._getDictionaryItemEnum({
          code: this.formData.code,
          limit: this.page.pageSize,
          page: this.page.pageNumber,
          name: this.formData.name,
          parentCode: this.parentData.code
        })
        this.$refs.editEnum.dialogVisible = false;
      } else {
        this.$message.error(result.msg)
      }
    },
    async _deleteEnumItem(params) {
      const result = await deleteEnumItem(params).catch(err => {
        this.$message.error(err.msg)
      })
      if (result?.code === '200') {
        this._getDictionaryItemEnum({
          code: this.formData.code,
          limit: this.page.pageSize,
          page: this.page.pageNumber,
          name: this.formData.name,
          parentCode: this.parentData.code
        })
      } else {
        this.$message.error(result.msg)
      }
    },
    onSearch() {
      this._getDictionaryItemEnum({
        code: this.formData.code,
          limit: this.page.pageSize,
          page: this.page.pageNumber,
          name: this.formData.name,
          parentCode: this.parentData.code
      })
    },
    onAdd() {
      this.$refs.addEnum.openDialog()
    },
    addOne(data) {
      const params = {
        "code": data.code,
        "name": data.name,
        "parentCode": this.parentData.code,
        "remark": data.desc,
        "sortNum": Number(data.sort)
      }
      this._addEnumItem(params)
    },
    onEdit(row) {
      this.$refs.editEnum.openDialog(row)
    },
    update(params) {
      this._editEnumItem({
        "code": params.code,
        "id": params.id,
        "name": params.name,
        "parentCode": this.parentData.code,
        "remark": params.desc,
        "sortNum": params.sort
      })
    },
    onDelete(row) {
      this.$confirm(`是否确认删除枚举: ${row.name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._deleteEnumItem({
          id: row.id
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
      setTimeout(() => {
        const domList = document.getElementsByClassName('el-message-box__wrapper')
        for (let i = 0; i < domList.length; i++) {
          domList[i].style.zIndex = 9999;
        }
      }, 100)
    },
    handleCurrentChange(number) {
      this.page.pageNumber = number
      this._getDictionaryItemEnum({
        code: this.formData.code,
          limit: this.page.pageSize,
          page: number,
          name: this.formData.name,
          parentCode: this.parentData.code
      })
    },
    handlerToCloseDom() {
      this.$parent.seeDictionaryDetail = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.dictionary-management-inner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #212739;
  z-index: 1000;
  padding: 50px 20px 20px 20px;
  box-sizing: border-box;
  ::v-deep .el-table__cell {
    background: #212739 !important;
  }
}
</style>
<style>
.el-message-box p {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
  