<template>
  <div>
    <div class="ProcessInformation-title">
      <div class="title-item" v-for="({ label, value }, index) in processDisplayInfo" :key="index">
        <span>{{ label }}</span
        >:
        <span>{{ value }}</span>
      </div>
    </div>
    <div class="ProcessInformation-bpmn">
      <bpmn-editor
        :pelatteVisible="false"
        :headerVisible="false"
        :linterToggle="false"
        :xml="xml"
        @loaded="onBpmnLoaded"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProcessInformation',
  props: {
    xml: {
      type: String,
      default: '',
    },
    processDisplayInfo: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    onBpmnLoaded() {
      this.$emit('loaded')
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
