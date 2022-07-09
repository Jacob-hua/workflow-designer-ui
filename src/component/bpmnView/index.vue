<template>
  <div class="bpmnView">
    <div class="bpmnView-title" v-if="valueType === 'project'">
      <div class="title-item">
        <span class="title-item-label"> 项目 </span>
        <div class="title-item-main">
          <el-select v-model="projectData.ascription" disabled>
            <el-option
              v-for="{ id, label, value } in rootOrganizations"
              :key="id"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="title-item">
        <span class="title-item-label"> 业务类型 </span>
        <div class="title-item-main">
          <el-cascader
            v-model="projectData.business"
            disabled
            :key="projectData.ascription"
            :options="rootOrganizationChildren(projectData.ascription)"
          ></el-cascader>
        </div>
      </div>
      <div class="title-item">
        <span class="title-item-label"> 流程编码 </span>
        <div class="title-item-main">
          <el-input v-model="projectData.numberCode" placeholder="" :disabled="true"></el-input>
        </div>
      </div>
      <div class="title-item">
        <span class="title-item-label"> 流程名称 </span>
        <el-tooltip class="item" effect="dark" :content="projectData.name" placement="top-start">
          <div class="title-item-main">
            <el-input v-model="projectData.name" placeholder="" :disabled="true"></el-input>
          </div>
        </el-tooltip>
      </div>
      <div class="title-item">
        <span class="title-item-label"> 创建时间 </span>
        <div class="title-item-main">
          <el-input v-model="projectData.createTime" placeholder="" :disabled="true"></el-input>
        </div>
      </div>
    </div>
    <div class="bpmnView-title" v-if="valueType === 'public'">
      <div class="bpmnView-title-public">
        <span class="bpmnView-title-public-label">流程编码:</span
        ><span class="bpmnView-title-public-value">{{ projectData.numberCode }}</span>
        <span class="bpmnView-title-public-label">流程名称:</span
        ><span class="bpmnView-title-public-value">{{ projectData.name }}</span>
        <span class="bpmnView-title-public-label">创建时间:</span
        ><span class="bpmnView-title-public-value">{{ projectData.createTime }}</span>
      </div>
    </div>
    <div class="bpmnView-process">
      <span class="bpmn-Main-title">BPMN流程</span>
      <bpmn-editor
        key="processInfomation"
        :pelatteVisible="false"
        :headerVisible="false"
        :linterToggle="false"
        :xml="projectData.content"
      />
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
    projectData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapGetters('config', ['rootOrganizations', 'rootOrganizationChildren']),
  },
}
</script>

<style scoped lang="scss">
.bpmnView-title {
  border-bottom: 1px solid $border-color-1;
  margin-bottom: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  color: $font-color;
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

::v-deep .el-input__inner {
  width: 180px;
  height: 43px;
  line-height: 43px;
  padding: 0px 10px;
  background-color: #f2f2f2;
}

.bpmnView-process {
  height: 600px;
  border: 1px solid $border-color-1;
  position: relative;
}

.bpmn-Main-title {
  position: absolute;
  font-weight: 700;
  color: $font-color;
  font-size: 13px;
  top: 10px;
  left: 10px;
}

::v-deep .djs-palette {
  display: none;
}

::v-deep .djs-context-pad {
  display: none;
}
</style>
