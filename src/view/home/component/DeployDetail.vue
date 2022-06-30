<template>
  <el-dialog title="部署工作流" :visible.sync="dialogVisible2" width="70%" custom-class="dialogVisible1">
    <div>
      <ProcessInformation
        type="details2"
        ref="details2"
        v-if="dialogVisible2"
        @selection="selection"
        :seeType="seeType"
        :business="business"
      ></ProcessInformation>
    </div>
    <div class="bpmn-configure">
      <div class="bpmn-configure-basic">
        <div class="bpmn-configure-title">工单分配</div>
        <div class="bpmn-configure-Main">
          <div class="bpmn-configure-Main-item">
            <span>名<span style="visibility: hidden">占位</span>称</span>: <span>{{ bpmnData.name }}</span>
          </div>
          <div class="bpmn-configure-Main-item">
            <span>绑定岗位</span>: <span>{{ bpmnData.grounp }}</span>
          </div>
          <div class="bpmn-configure-Main-item">
            <span>绑定人员</span>: <span>{{ bpmnData.assignee }}</span>
          </div>
          <div class="bpmn-configure-Main-item">
            <span>备<span style="visibility: hidden">占位</span>注</span>: <span>{{ bpmnData.document }}</span>
          </div>
        </div>
      </div>
      <div class="bpmn-configure-form">
        <div class="bpmn-configure-title">工单分配-表单内容</div>
        <div class="bpmn-configure-Main">
          <span v-if="!formShow" class="noneForm"> 当前未关联表单 </span>
          <div v-if="formShow" class="formShowForm">
            <preview :itemList="formListFun(formContent)" :formConf="configFun(formContent)" v-if="formShow"></preview>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer" v-if="seeType === 'delete'">
      <el-button @click="deleteDeployment()" v-role="{ id: 'HomeDelete', type: 'button', business: business }"
        >删除</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'DeployDetail',
}
</script>

<style></style>
