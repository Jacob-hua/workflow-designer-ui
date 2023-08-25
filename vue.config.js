const { name } = require('./package')

module.exports = {
  publicPath: './',
  runtimeCompiler: true,
  configureWebpack: {
    devtool: 'source-map',
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },
  devServer: {
    host: '0.0.0.0',
    port: 8818,
    public: '192.100.4.34:8818',
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      [`${process.env.VUE_APP_BASE_API}`]: {
        target: 'http://192.100.4.24:8060/workflow', // 刘旺
        // target: 'http://192.100.4.35:8060/workflow/', //李柯
        // target: "http://192.100.8.80:8060",
        // target: 'http://k8s.isiact.com/workflow-runtime-service',
        // target: 'http://k8s.isiact.com/kms-runtime-service/workflow', // 康明斯
        changeOrigin: true, //是否允许跨域
        pathRewrite(path) {
          const reg = new RegExp(`${process.env.VUE_APP_BASE_API}`)
          return path.replace(reg, '')
        },
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
    config.module.rule('fonts').use('url-loader').loader('url-loader').options({}).end()
    config.module.rule('images').use('url-loader').loader('url-loader').options({}).end()
  },
}
