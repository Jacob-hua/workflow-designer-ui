<template>
  <div style="margin-top: 16px">
    <el-form-item label="处理用户" class="flexDis">
      <!-- <el-input v-model="userTaskForm.assignee" clearable @change="updateElementTask('assignee')" /> -->
      <!-- <el-select v-model="userTaskForm.assignee" @change="updateElementTask('assignee')">
              <el-option v-for="ak in mockData" :key="'ass-' + ak" :label="`用户${ak}`" :value="`user${ak}`" />
            </el-select> -->
      <el-cascader
           v-model="value"
           :options="options"
           :props="{
             children: 'apiList',
             label: 'name',
             value: 'id'
           }"
           @change="handleChange"
           ref="elCascader">
       </el-cascader>
       
      <el-input v-model="userTaskForm.assignee" @change="updateElementTask('assignee')" :disabled="true"/>
    </el-form-item>
    <el-form-item label="候选用户">
      <el-select v-model="userTaskForm.candidateUsers" multiple collapse-tags @change="updateElementTask('candidateUsers')">
        <el-option v-for="uk in mockData" :key="'user-' + uk" :label="`用户${uk}`" :value="`user${uk}`" />
      </el-select>
      <!-- <el-input v-model="userTaskForm.candidateUsers" clearable @change="updateElementTask('candidateUsers')" /> -->
    </el-form-item>
    <el-form-item label="候选分组">
      <el-select v-model="userTaskForm.candidateGroups" multiple collapse-tags @change="updateElementTask('candidateGroups')">
        <el-option v-for="gk in mockData" :key="'ass-' + gk" :label="`分组${gk}`" :value="`group${gk}`" />
      </el-select>
      <!-- <el-input v-model="userTaskForm.candidateGroups" clearable @change="updateElementTask('candidateGroups')" /> -->
    </el-form-item>
    <el-form-item label="到期时间">
      <el-input v-model="userTaskForm.dueDate" clearable @change="updateElementTask('dueDate')" />
    </el-form-item>
    <el-form-item label="跟踪时间">
      <el-input v-model="userTaskForm.followUpDate" clearable @change="updateElementTask('followUpDate')" />
    </el-form-item>
    <el-form-item label="优先级">
      <el-input v-model="userTaskForm.priority" clearable @change="updateElementTask('priority')" />
    </el-form-item>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <div class="dialogVisibleBody">
        <div class="dialogVisibleForm">
          <el-form-item :label="item.ch_name" v-for="(item, index) in formData" :key="index">
            <el-input v-model="postForm[item.param]" clearable @change="updateElementTask('followUpDate')" />
          </el-form-item>
          <div class="dialogVisibleFormFooter">
            <el-button type="primary" @click="postData()" size="mini">查询数据</el-button>
          </div>
        </div>
        <div class="dialogVisibleTable">
          
        </div>
      </div>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
        candidateUsers: [],
        candidateGroups: [],
        dueDate: "",
        followUpDate: "",
        priority: ""
      },
      formData: [],
      postForm: {},
      value: '',
      valueObj: {},
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
        tenantId: '1',
        isUse: 1
      }).then((res) => {
        this.options = res.result
      })
    },
    postData() {
      extraApi({
        sourceMark: this.valueObj.parent.data.sourceMark,
        apiMark: this.valueObj.data.apiMark,
        ...this.postForm
      }).then((res) => {
        console.log(res)
      })
    },
    handleChange() {
      this.postForm = {}
      this.dialogVisible = true
      this.valueObj = this.$refs.elCascader.getCheckedNodes()[0]
      console.log(this.$refs.elCascader.getCheckedNodes()[0].data)
      this.formData = JSON.parse(this.$refs.elCascader.getCheckedNodes()[0].data.dataMap)
      console.log(this.formData, '99999')
      this.formData.forEach((item) => {
        this.$set(this.postForm, item.param, '')
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    resetTaskForm() {
      // console.log(this.bpmnElement, '0000')
      for (let key in this.defaultTaskForm) {
        let value;
        if (key === "candidateUsers" || key === "candidateGroups") {
          value = this.bpmnElement?.businessObject[key] ? this.bpmnElement.businessObject[key].split(",") : [];
        } else {
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
        taskAttr[key] = this.userTaskForm[key] && this.userTaskForm[key].length ? this.userTaskForm[key].join() : null;
      } else {
        taskAttr[key] = this.userTaskForm[key] || null;
      }
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, taskAttr);
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
