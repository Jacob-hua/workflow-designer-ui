<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      routerMapping: {
        bpmn: 'Workflow',
        form: 'Form',
        home: 'Home',
        runTime: 'RunTime',
        history: 'History',
        all: 'Configuration',
        power: 'Power',
      },
      roleGo: ['login', 'noPermission'],
    }
  },
}
</script>

<style lang="scss">
html {
  height: 100%;
}

body {
  overflow: hidden;
  margin: 0;
  box-sizing: border-box;
  height: 100%;
}

#app {
  height: 100%;
  box-sizing: border-box;
  background-color: $theme-bg-color;
}

.bjs-powered-by {
  display: none;
}

.fjs-powered-by {
  display: none;
}

.svgOncomplete .djs-visual {
  -webkit-animation: test 18s linear infinite;
  -webkit-animation-fill-mode: forwards;
}

.svgIncomplete .djs-visual rect {
  stroke: grey !important;
  stroke-dasharray: 3 4;
}

.svgComplete .djs-visual rect {
  stroke: green !important;
}

.svgOncomplete .djs-visual rect {
  stroke: #0055ff !important;
  stroke-dasharray: 3 4;
}

.svgIncomplete .djs-visual .djs-label {
  fill: grey !important;
}

.svgOncomplete .djs-visual .djs-label {
  fill: #0055ff !important;
}

.svgComplete .djs-visual .djs-label {
  fill: green !important;
}

.el-dialog .el-dialog__footer {
  text-align: center;
}
</style>
