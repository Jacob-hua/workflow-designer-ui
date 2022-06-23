<template>
  <div>
    <div class="ProcessInformation-title">
      <div class="title-item">
        <span> 流程编码：</span>
        <span>
          {{ processInfo.processNumber }}
        </span>
      </div>
      <div class="title-item">
        <span> {{ seeType === 'runTime' ? '部署' : '流程' }}名称：</span>
        <span>
          {{ processInfo.processDeployName }}
        </span>
      </div>
      <div class="title-item">
        <span> {{ seeType === 'runTime' ? '部署' : '创建' }}时间：</span>
        <span>
          {{ processInfo.startTime }}
        </span>
      </div>
      <div class="title-item">
        <span> 应用项目：</span>
        <span>
          {{ $getMappingName(processInfo.ascription) }}
        </span>
      </div>
      <div class="title-item">
        <span> 流程类型：</span>
        <span>
          {{ $getMappingName(processInfo.business) }}
        </span>
      </div>
      <div class="title-item" v-if="seeType === 'runTime'">
        <span> {{ seeType === 'runTime' ? '部署人' : '流程版本' }}： </span>
        <span>
          {{ processInfo.starter }}
        </span>
      </div>
    </div>
    <div class="ProcessInformation-bpmn">
      <bpmn-editor
        :pelatteVisible="false"
        :headerVisible="false"
        :linterToggle="false"
        :xml="processInfo.processDeployResource"
        @loaded="onBpmnLoaded"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProcessInformation',
  props: {
    seeType: {
      type: String,
      default: 'delete',
    },
    processInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    onBpmnLoaded() {
      // TODO: 此处应该禁用画布的选择事件的
      const completedTaskList = this.processInfo.trackList
        .filter(({ taskKey }) => taskKey !== this.processInfo.taskKey)
        .map(({ taskKey }) => taskKey)
      this.$iBpmn
        .elementRegistryFilter(({ type }) => type === 'bpmn:UserTask')
        .forEach((element) => {
          if (element.id === this.processInfo.taskKey) {
            this.$iBpmn.canvasAddMarker(element, 'svgOncomplete')
            return
          }
          if (completedTaskList.includes(element.id)) {
            this.$iBpmn.canvasAddMarker(element, 'svgComplete')
            return
          }
          this.$iBpmn.canvasAddMarker(element, 'svgIncomplete')
        })
      this.$emit(
        'executeShape',
        this.$iBpmn.elementRegistryFind(({ id }) => id === this.processInfo.taskKey)
      )
    },
  },
}
</script>

<style scoped="scoped">
.ProcessInformation-title {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  align-content: space-around;
}

.title-item {
  line-height: 40px;
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

.marginLeft40 {
  margin-left: 70px;
}

.ProcessInformation-bpmn {
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

.bnpmTitle {
  font-weight: 700;
  color: black;
  position: relative;
  top: -15px;
  left: 10px;
}

.bnpmSwitch {
  position: relative;
  top: -15px;
  left: 1140px;
}
</style>
