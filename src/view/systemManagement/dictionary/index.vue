<template>
  <div class="dictionary-management">
    <el-form :inline="true" :model="formData" class="search-wrapper" size="mini">
      <el-form-item label="业务">
        <!-- <el-input v-model="formData.business" placeholder="业务"></el-input> -->
        <el-cascader
          v-model="formData.business"
          :options="options"
          :props="{
            emitPath: true,
            checkStrictly: true,
          }"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="字典名称">
        <el-input v-model="formData.name" placeholder="字典名称"></el-input>
      </el-form-item>
      <el-form-item label="字典code">
        <el-input v-model="formData.code" placeholder="字典code"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onAdd">新增字典</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      stripe
      height="550px"
      style="width: 100%">
      <el-table-column
        label="字典名称">
        <template slot-scope="scope">
          <!-- {{ scope.row.name }} -->
          <el-tooltip :content="scope.row.name" :open-delay="500" placement="top">
            <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ scope.row.name }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="字典code">
        <template slot-scope="scope">
          <!-- {{ scope.row.name }} -->
          <el-tooltip :content="scope.row.code" :open-delay="500" placement="top">
            <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ scope.row.code }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        width="300"
        label="字典描述">
        <template slot-scope="scope">
          <!-- {{ scope.row.name }} -->
          <el-tooltip :content="scope.row.remark" :open-delay="500" placement="top">
            <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ scope.row.remark }}</div>
          </el-tooltip>
        </template>
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
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
          <el-button @click="onSee(scope.row)" type="text" size="small">查看</el-button>
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
    <AddDictionary ref="addDom" @addOne="addOne" />
    <EditDictionary ref="editDom" @update="updateItem" />
    <SeeDictionary ref="seeDom" v-if="seeDictionaryDetail" />
  </div>
</template>

<script>
import { getDictionaryList, addDictionaryItem, editDictionaryItem, deleteDictionaryItem } from '@/api/systemManagement.js'
import AddDictionary from './components/addDictionary.vue'
import EditDictionary from './components/editDictionary.vue'
import SeeDictionary from './components/seeDictionary.vue'
export default {
  components: {
    AddDictionary,
    EditDictionary,
    SeeDictionary
  },
  data() {
    return {
      seeDictionaryDetail: false,
      formData: {
        business: [],
        name: '',
        code: ''
      },
      options: [],
      tableData: [],
      page: {
        pageNumber: 1,
        pageSize: 8,
        total: 0
      }
    }
  },
  computed: {
  },
  created() {
    this.$store.dispatch('config/dispatchProjectOriganizations').then(() => {
      this.options = this.$store.state.config.organizations
    })
  },
  mounted() {
    this._getDictionaryList({
      limit: this.page.pageSize,
      page: this.page.pageNumber,
      name: this.formData.name,
      code:this.formData.code,
      applicationId: this.formData.business[2] ?? '',
      tenantId: this.formData.business[0] ?? '',
      projectId: this.formData.business[1] ?? ''
    })
  },
  methods: {
    async _getDictionaryList(params) {
      const result = await getDictionaryList(params).catch(err => {
        this.$message.error(err.msg)
      })
      if (result?.code === '200') {
        this.tableData = result.data.dataList
        this.page.total = Number(result.data.total)
      }
    },
    async _addDictionaryItem(params) {
      const result = await addDictionaryItem(params).catch(err => {
        this.$message.error(err.msg)
      })
      if (result?.code === '200') {
        this.$message.success('添加成功')
        this._getDictionaryList({
          limit: this.page.pageSize,
          page: this.page.pageNumber,
          name: this.formData.name,
          code:this.formData.code,
          applicationId: this.formData.business[2] ?? '',
          tenantId: this.formData.business[0] ?? '',
          projectId: this.formData.business[1] ?? ''
        })
        this.$refs.addDom.dialogVisible = false;
      } else {
        this.$message.error(result.msg)
      }
    },
    async _editDictionaryItem(params) {
      const result = await editDictionaryItem(params).catch(err => {
        this.$message.error(err.msg)
      })
      if (result?.code === '200') {
        this.$message.success('编辑成功')
        this._getDictionaryList({
          limit: this.page.pageSize,
          page: this.page.pageNumber,
          name: this.formData.name,
          code:this.formData.code,
          applicationId: this.formData.business[2] ?? '',
          tenantId: this.formData.business[0] ?? '',
          projectId: this.formData.business[1] ?? ''
        })
        this.$refs.editDom.dialogVisible = false;
      } else {
        this.$message.error(result.msg)
      }
    },
    async _deleteDictionaryItem(params) {
      const result = await deleteDictionaryItem(params).catch(err => {
        this.$message.error(err.msg)
      })
      if (result?.code === '200') {
        this.$message.success('删除成功')
        this._getDictionaryList({
          limit: this.page.pageSize,
          page: this.page.pageNumber,
          name: this.formData.name,
          code:this.formData.code,
          applicationId: this.formData.business[2] ?? '',
          tenantId: this.formData.business[0] ?? '',
          projectId: this.formData.business[1] ?? ''
        })
      } else {
        this.$message.error(result.msg)
      }
    },
    onSearch() {
      this._getDictionaryList({
        limit: this.page.pageSize,
        page: this.page.pageNumber,
        name: this.formData.name,
        code:this.formData.code,
        applicationId: this.formData.business[2] ?? '',
        tenantId: this.formData.business[0] ?? '',
        projectId: this.formData.business[1] ?? ''
      })
    },
    onAdd() {
      this.$refs.addDom.openDialog()
    },
    addOne(obj) {
      const params = {
        "code": obj.code,
        "name": obj.name,
        "projectId": obj.business[1] ?? '',
        "remark": obj.desc,
        "tenantId": obj.business[0] ?? '',
        "applicationId": obj.business[2] ?? ''
      }
      this._addDictionaryItem(params);
    },
    onEdit(row) {
      this.$refs.editDom.openDialog(row)
    },
    updateItem(data) {
      const params = {
        "code": data.code,
        "name": data.name,
        "remark": data.desc,
        "id": data.id
      }
      this._editDictionaryItem(params)
    },
    onDelete(row) {
      this.$confirm(`是否确认删除字典: ${row.name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._deleteDictionaryItem({
          id: row.id
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    onSee(row) {
      this.seeDictionaryDetail = true;
      setTimeout(() => {
        this.$refs.seeDom.getParentData(row)
        this.$refs.seeDom._getDictionaryItemEnum({
          code: '',
          limit: 12,
          page: 1,
          name: '',
          parentCode: row.code
        })
      }, 100)
    },
    handleCurrentChange(number) {
      this.page.pageNumber = number
      this._getDictionaryList({
        limit: this.page.pageSize,
        page: this.page.pageNumber,
        name: this.formData.name,
        code:this.formData.code,
        applicationId: this.formData.business[2] ?? '',
        tenantId: this.formData.business[0] ?? '',
        projectId: this.formData.business[1] ?? ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dictionary-management {
  overflow: hidden;
  height: 640px;
  ::v-deep .el-table__cell {
    background: #212739 !important;
  }
}
</style>
