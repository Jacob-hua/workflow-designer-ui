<template>
  <div>
    <div class="ProcessInformation-title">
      <div class="title-item">
        <span class="title-item-label"> 流程编码：</span>
        <div class="title-item-main">
          {{ processInfo.numberCode }}
        </div>
      </div>
      <div class="title-item">
        <span class="title-item-label marginLeft40"> {{ seeType === 'runTime' ? '部署' : '流程' }}名称：</span>
        <div class="title-item-main">
          {{ processInfo.processName }}
        </div>
      </div>

      <div class="title-item">
        <span class="title-item-label marginLeft40"> {{ seeType === 'runTime' ? '部署' : '创建' }}时间：</span>
        <div class="title-item-main">
          {{ processInfo.startTime }}
        </div>
      </div>
      <div class="title-item">
        <span class="title-item-label marginLeft40"> 应用项目：</span>
        <div class="title-item-main">
          {{ $getMappingName(processInfo.ascription) }}
        </div>
      </div>
      <div class="title-item">
        <span class="title-item-label marginLeft40"> 流程类型：</span>
        <div class="title-item-main">
          {{ $getMappingName(processInfo.business) }}
        </div>
      </div>
      <div class="title-item" v-if="seeType === 'runTime'">
        <span class="title-item-label marginLeft40">
          {{ seeType === 'runTime' ? '部署人' : '流程版本' }}
        </span>
        <div class="title-item-main">
          {{ processInfo.starter }}
        </div>
      </div>
    </div>
    <div class="ProcessInformation-bpmn">
      <bpmn-editor
        :pelatteVisible="false"
        :headerVisible="false"
        :linterToggle="false"
        :xml="processInfo.content"
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
      this.$emit('executeShape', this.$iBpmn.elementRegistryFind(({id}) => id === this.processInfo.taskKey))
    },
  },
}
</script>

<style scoped="scoped">
.ProcessInformation-title {
  border-bottom: 1px solid #cccccc;
  margin-bottom: 40px;
}

.title-item {
  display: inline-block;
  margin-bottom: 20px;
}

.title-item-label {
  margin-right: 15px;
  width: 60px;
  display: inline-block;
}

.title-item-main {
  display: inline-block;
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
