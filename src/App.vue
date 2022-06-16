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
body {
  overflow: hidden;
  margin: 0;
  box-sizing: border-box;
}

#app {
  box-sizing: border-box;
  min-width: 1920px;
  min-height: 1080px;
  background-color: white;
}

.bjs-powered-by {
  display: none;
}

.fjs-powered-by {
  display: none;
}

@-webkit-keyframes test {
  to {
    stroke-dashoffset: 100%;
  }
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
  // stroke: yellow !important;
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

// .fjs-properties-panel-text {
//   display: none;
// }

// .fjs-properties-panel-header-label {
//   display: none;
// }

body,
body * {
  /* 滚动条 */
  &::-webkit-scrollbar-track-piece {
    background-color: #fff;
    /*滚动条的背景颜色*/
    -webkit-border-radius: 0;
    /*滚动条的圆角宽度*/
  }

  &::-webkit-scrollbar {
    width: 10px;
    /*滚动条的宽度*/
    height: 8px;
    /*滚动条的高度*/
  }

  &::-webkit-scrollbar-thumb:vertical {
    /*垂直滚动条的样式*/
    height: 50px;
    background-color: rgba(153, 153, 153, 0.5);
    -webkit-border-radius: 4px;
    outline: 2px solid #fff;
    outline-offset: -2px;
    border: 2px solid #fff;
  }

  &::-webkit-scrollbar-thumb {
    /*滚动条的hover样式*/
    background-color: rgba(159, 159, 159, 0.3);
    -webkit-border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    /*滚动条的hover样式*/
    background-color: rgba(159, 159, 159, 0.5);
    -webkit-border-radius: 4px;
  }
}

.el-dialog .el-dialog__footer {
  text-align: center;
}
</style>
