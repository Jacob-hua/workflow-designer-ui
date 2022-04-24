<template>
  <div style="margin-top: 16px">
    <el-form-item label="处理用户" class="flexDis">
      <el-cascader v-model="assigneeValue" :options="options" :props="{
             children: 'apiList',
             label: 'name',
             value: 'id'
           }"
        @change="handleChange('assignee')" ref="assignee">
      </el-cascader>

      <el-input v-model="userTaskForm.assignee" @change="updateElementTask('assignee')" :disabled="true" />
    </el-form-item>
    <el-form-item label="候选用户" class="flexDis">
      <el-cascader v-model="candidateUsersValue" :options="options" :props="{
               children: 'apiList',
               label: 'name',
               value: 'id'
             }"
        @change="handleChange('candidateUsers')" ref="candidateUsers">
      </el-cascader>
      <el-input v-model="userTaskForm.candidateUsers" @change="updateElementTask('candidateUsers')" :disabled="true" :title="userTaskForm.candidateUsers" />
      <!-- <el-select v-model="userTaskForm.candidateUsers" multiple collapse-tags @change="updateElementTask('candidateUsers')"> -->
      <!-- <el-option v-for="uk in mockData" :key="'user-' + uk" :label="`用户${uk}`" :value="`user${uk}`" /> -->
      <!-- </el-select> -->
    </el-form-item>
    <el-form-item label="候选分组" class="flexDis">
      <el-cascader v-model="candidateGroupsValue" :options="options" :props="{
               children: 'apiList',
               label: 'name',
               value: 'id'
             }"
        @change="handleChange('candidateGroups')" ref="candidateGroups">
      </el-cascader>
      <el-input v-model="userTaskForm.candidateGroups" clearable @change="updateElementTask('candidateGroups')"
        :disabled="true" :title="userTaskForm.candidateGroups" />
      <!-- <el-select v-model="userTaskForm.candidateGroups" multiple collapse-tags @change="updateElementTask('candidateGroups')"> -->
      <!-- <el-option v-for="gk in mockData" :key="'ass-' + gk" :label="`分组${gk}`" :value="`group${gk}`" /> -->
      <!-- </el-select> -->
    </el-form-item>
    <el-form-item label="到期时间">
      <!-- <el-input v-model="userTaskForm.dueDate" clearable @change="updateElementTask('dueDate')" /> -->
      <el-date-picker v-model="userTaskForm.dueDate" type="datetime" @change="updateElementTask('dueDate')" value-format="yyyy-MM-ddTHH:mm:ss" placeholder="选择到期时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="跟踪时间">
      <!-- <el-input v-model="userTaskForm.followUpDate" clearable @change="updateElementTask('followUpDate')" /> -->
      <el-date-picker v-model="userTaskForm.followUpDate" type="datetime" @change="updateElementTask('followUpDate')"
        placeholder="选择跟踪时间" value-format="yyyy-MM-ddTHH:mm:ss">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="优先级">
      <el-input v-model="userTaskForm.priority" clearable @change="updateElementTask('priority')" />
    </el-form-item>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="60%" :before-close="handleClose" append-to-body>
      <div class="dialogVisibleBody">
        <div class="dialogVisibleForm">
          <el-form-item :label="index" v-for="(item, index) in formData" :key="index">
            <el-input v-model="postForm[index]" clearable />
          </el-form-item>
          <div class="dialogVisibleFormFooter">
            <el-button type="primary" @click="postData()" size="mini">查询数据</el-button>
          </div>
        </div>
        <div class="dialogVisibleTable">
          <div v-if="tableDataHeader.length > 0">
            <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" @select-all="onSelectAll" ref="elTable">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column :label="item" :prop="item" v-for="(item, index) in tableDataHeader" :key="index">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="upDataTask()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    apiCascade,
    extraApi
  } from '@/unit/api.js'
  export default {
    name: "UserTask",
    props: {
      id: String,
      type: String
    },
    data() {
      return {
        defaultTaskForm: {
          assignee: "",
          candidateUsers: '',
          candidateGroups: '',
          dueDate: "",
          followUpDate: "",
          priority: ""
        },
        tableData: [],
        tableDataHeader: [],
        multipleSelection: [],
        formData: [],
        postForm: {},
        valueCode: '',
        assigneeValue: '',
        assigneeValueObj: {},
        candidateUsersValue: '',
        candidateUsersValueObj: {},
        candidateGroupsValue: '',
        candidateGroupsValueObj: {},
        options: [],
        dialogVisible: false,
        userTaskForm: {},
        mockData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      };
    },
    watch: {
      id: {
        immediate: true,
        handler() {
          this.bpmnElement = window.bpmnInstances.bpmnElement;
          this.$nextTick(() => this.resetTaskForm());
        }
      }
    },
    methods: {
      getOption() {
        apiCascade({
          tenantId: 18,
          isUse: 1
        }).then((res) => {
          this.options = res.result
          window.bpmnInstances.modeling.updateProperties(this.bpmnElement , { formKey: '' });
        })
      },
      postData() {
        let postData = ''
        if (this.assigneeValueObj.data.method === "GET") {
          Object.keys(this.postForm).forEach((item, index) => {
            if (index === 0) {
              postData = postData + `?${item}=${this.postForm[item]}`
            } else {
              postData = postData + `&${item}=${this.postForm[item]}`
            }
          })
        } else {
          postData = this.postForm
        }
        extraApi({
          sourceMark: this.assigneeValueObj.parent.data.sourceMark,
          apiMark: this.assigneeValueObj.data.apiMark,
          data: postData
        }).then((res) => {
          let result = res.result
          console.log(Array.isArray(result))
          if (Array.isArray(result)) {
            this.tableData = result
            this.tableDataHeader = Object.keys(result[0])
          } else {
            this.tableData = [result]
            this.tableDataHeader = Object.keys(result)
          }
        })
      },
      handleChange(value) {
        this.valueCode = value
        this.postForm = {}
        this.tableData = []
        this.tableDataHeader = []
        this.multipleSelection = []
        this.dialogVisible = true
        this.assigneeValueObj = this.$refs[value].getCheckedNodes()[0]
        this.formData = JSON.parse(this.$refs[value].getCheckedNodes()[0].data.body)
        Object.keys(this.formData).forEach((item) => {
          this.$set(this.postForm, item, '')
        })
      },
      handleClose() {
        this.dialogVisible = false
      },
      upDataTask() {
        this.dialogVisible = false
        switch (this.valueCode){
          case 'assignee':
            this.userTaskForm.assignee = this.multipleSelection[0].userId
            this.updateElementTask('assignee')
            break;
          case 'candidateUsers':
            this.multipleSelection.forEach((item, index) => {
              if (index === this.multipleSelection.length - 1) {
                this.userTaskForm.candidateUsers = this.userTaskForm.candidateUsers + item.userId
              } else{
                this.userTaskForm.candidateUsers = this.userTaskForm.candidateUsers + item.userId + ','
              }
            })
            this.updateElementTask('candidateUsers')
            break;
          case 'candidateGroups':
            this.multipleSelection.forEach((item, index) => {
              if (index === this.multipleSelection.length - 1) {
                this.userTaskForm.candidateGroups = this.userTaskForm.candidateGroups + item.grouId
              } else{
                this.userTaskForm.candidateGroups = this.userTaskForm.candidateGroups + item.grouId + ','
              }
            })
            this.updateElementTask('candidateGroups')
            break;
          default:
            break;
        }
        this.valueCode = ''
      },
      resetTaskForm() {
        // console.log(this.bpmnElement, '0000')
        for (let key in this.defaultTaskForm) {
          let value;
          if (key === "candidateUsers" || key === "candidateGroups") {
            // value = this.bpmnElement ?.businessObject[key] ? this.bpmnElement.businessObject[key].split(",") : [];
            value = this.bpmnElement?.businessObject[key] || this.defaultTaskForm[key];
          } else {
            console.log(this.bpmnElement?.businessObject[key], key, this.bpmnElement)
            value = this.bpmnElement?.businessObject[key] || this.defaultTaskForm[key];
          }

          // value = this.bpmnElement.businessObject.$attrs['camunda:' + key]

          this.$set(this.userTaskForm, key, value);
        }
        this.getOption()
      },
      updateElementTask(key) {
        const taskAttr = Object.create(null);
        if (key === "candidateUsers" || key === "candidateGroups") {
          // taskAttr[key] = this.userTaskForm[key] && this.userTaskForm[key].length ? this.userTaskForm[key].join() : null;
          taskAttr[key] = this.userTaskForm[key] || null;
        } else {
          taskAttr[key] = this.userTaskForm[key] || null;
        }
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, taskAttr);
      },
      handleSelectionChange(val) {
        if (this.valueCode === 'assignee') {
          if (val.length > 1) {
            this.$refs.elTable.clearSelection()
            this.$refs.elTable.toggleRowSelection(val.pop())
          } else {
            this.multipleSelection = val;
          }
        } else{
          this.multipleSelection = val;
        }
      },
      onSelectAll() {
        if (this.valueCode === 'assignee') {
          
        } else{
          this.$refs.elTable.clearSelection()
        }
      }
    },
    beforeDestroy() {
      this.bpmnElement = null;
    }
  };
</script>

<style scoped="scoped">
  /deep/ .flexDis .el-cascader--mini {
    width: 30%;
    margin-right: 10px;
  }

  /deep/ .flexDis .el-cascader--mini .el-input {
    width: 100%;
  }

  /deep/ .flexDis .el-input--mini {
    width: 60%;
  }

  /deep/ .el-dialog__body .el-input {
    width: 80%;
  }

  .dialogVisibleBody {
    display: flex;
  }

  .dialogVisibleForm {
    flex: 1;
  }

  .dialogVisibleFormFooter {
    text-align: center;
    margin-top: 20px;
  }

  .dialogVisibleTable {
    flex: 1;
  }
</style>
