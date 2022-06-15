<template>
  <div class="bpmnView">
    <div class="bpmnView-title"
         v-if="valueType === 'project'">
      <div class="title-item">
        <span class="title-item-label">
          项目
        </span>
        <div class="title-item-main">
          <el-select v-model="postData.ascription"
                     disabled>
            <el-option v-for="{id, label, value} in rootOrganizations"
                       :key="id"
                       :label="label"
                       :value="value"></el-option>
          </el-select>
        </div>
      </div>
      <div class="title-item">
        <span class="title-item-label">
          业务类型
        </span>
        <div class="title-item-main">
          <el-cascader v-model="postData.business"
                       disabled
                       :key="projectCode"
                       :options="rootOrganizationChildren(projectCode)"
                       :props='cascaderProps'></el-cascader>
        </div>
      </div>
      <div class="title-item">
        <span class="title-item-label">
          流程编码
        </span>
        <div class="title-item-main">
          <el-input v-model="postData.numberCode"
                    placeholder=""
                    :disabled="true"></el-input>
        </div>
      </div>
      <div class="title-item">
        <span class="title-item-label">
          流程名称
        </span>
        <el-tooltip class="item"
                    effect="dark"
                    :content="postData.name"
                    placement="top-start">
          <div class="title-item-main">
            <el-input v-model="postData.name"
                      placeholder=""
                      :disabled="true"></el-input>
          </div>
        </el-tooltip>
      </div>
      <div class="title-item">
        <span class="title-item-label">
          创建时间
        </span>
        <div class="title-item-main">
          <el-input v-model="postData.createTime"
                    placeholder=""
                    :disabled="true"></el-input>
        </div>
      </div>
    </div>
    <div class="bpmnView-title"
         v-if="valueType === 'public'">
      <div class="bpmnView-title-public">
        <span class="bpmnView-title-public-label">流程编码:</span><span class="bpmnView-title-public-value">{{postData.numberCode}}</span>
        <span class="bpmnView-title-public-label">流程名称:</span><span class="bpmnView-title-public-value">{{postData.name}}</span>
        <span class="bpmnView-title-public-label">创建时间:</span><span class="bpmnView-title-public-value">{{postData.createTime}}</span>
      </div>
      <div class="bpmnView-title-button">
        <el-button type="primary"
                   @click="$emit('edit')">编辑</el-button>
      </div>
    </div>
    <div class="bpmnView-process">
      <span class="bpmn-Main-title">BPMN流程</span>
      <bpmn-editor :pelatteVisible="false"
                   :headerVisible="false"
                   :linterToggle="false"
                   :xml="postData.content" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    valueType: {
      type: String,
      default: 'project',
    },
  },
  data() {
    return {
      postData: {},
    }
  },
  computed: {
    ...mapGetters('config', ['rootOrganizations', 'rootOrganizationChildren']),
  },
}
</script>

<style scoped="scoped">
.bpmnView-title {
  border-bottom: 1px solid #cccccc;
  margin-bottom: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
}

.title-item {
  display: inline-block;
  margin-bottom: 20px;
}

.title-item-label {
  margin-right: 15px;
}

.title-item-main {
  display: inline-block;
}

.bpmnView-title-public {
  display: inline-block;
}

.bpmnView-title-button {
  display: inline-block;
  vertical-align: top;
}

.bpmnView-title-public-label {
  display: inline-block;
  font-weight: 700;
  margin-left: 20px;
  margin-right: 20px;
}

::v-deep .el-input.is-disabled .el-input__inner {
  color: black;
  width: 180px;
  height: 43px;
  line-height: 43px;
  padding: 0px 10px;
  background-color: #f2f2f2;
}

::v-deep .el-input__inner {
  width: 180px;
  height: 43px;
  line-height: 43px;
  padding: 0px 10px;
  background-color: #f2f2f2;
}

.bpmnView-process {
  height: 400px;
  border: 1px solid black;
  position: relative;
}

.bpmn-Main-title {
  position: absolute;
  font-weight: 700;
  color: black;
  font-size: 13px;
  top: 10px;
  left: 10px;
}

.my-process-designer__canvas {
  height: 100%;
}

::v-deep .djs-palette {
  display: none;
}

::v-deep .djs-context-pad {
  display: none;
}

.bpmn-configure {
  display: flex;
}

.noneForm {
  display: inline-block;
  height: 160px;
  width: 100%;
  text-align: center;
  line-height: 160px;
}

.bpmn-configure-title {
  height: 40px;
  line-height: 40px;
}

.bpmn-configure-basic {
  flex: 1;
}

.bpmn-configure-Main {
  height: 200px;
  border: 1px solid #000000;
  padding: 20px 10px;
  overflow: auto;
  position: relative;
}

.bpmn-configure-Main-item {
  margin-bottom: 20px;
  color: black;
}

.bpmn-configure-form {
  flex: 3;
  margin-left: 20px;
}
</style>
