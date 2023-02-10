module.exports = {
  publicPath: './',
  runtimeCompiler: true,
  configureWebpack: {
    devtool: 'source-map',
  },
  devServer: {
    proxy: {
      '': {
        // target: 'http://192.100.4.25:8060', // 刘旺
        // target: "http://192.100.8.80:8060",
        // target: 'http://k8s.isiact.com/workflow-runtime-service',
        target: 'http://k8s.isiact.com/kms-runtime-service', // 康明斯
        changeOrigin: true, //是否允许跨域
      },
    },
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import '~@/assets/style/index.scss';`,
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = '流程引擎工作台'
      return args
    })
    config.module
      .rule('bpmnlint')
      .test(/\.bpmnlintrc$/)
      .use('bpmnlint-loader')
      .loader('bpmnlint-loader')
      .end()
  },
}
