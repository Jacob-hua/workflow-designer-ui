const { name } = require('./package');
const webpack = require('webpack');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  runtimeCompiler: true,
  configureWebpack: {
    devtool: 'source-map',
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          QIAN_KUN_URL: JSON.stringify(process.env.QIAN_KUN_URL),
        },
      }),
    ],
  },
  devServer: {
    host: '0.0.0.0',
    port: 8818,
    public:
      require('os').networkInterfaces()[
        Object.keys(require('os').networkInterfaces())[0]
      ][1].address + ':8818',
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    hot: true,
    proxy: {
      [`${process.env.VUE_APP_BASE_API}`]: {
        // target: 'http://192.100.4.24:19931/', // 刘旺
        // target: 'http://192.100.4.35:8060/workflow/', //李柯
        target: "http://192.100.8.20:10001",
        // target: 'http://k8s.isiact.com/workflow-runtime-service',
        // target: 'http://k8s.isiact.com/kms-runtime-service/workflow', // 康明斯
        // target: 'http://workflow-dev.isiact.com/kms/workflow/',
        // target: 'http://192.100.4.35:19932/',
        changeOrigin: true, //是否允许跨域
        pathRewrite(path) {
          const reg = new RegExp(`${process.env.VUE_APP_BASE_API}`);
          return path.replace(reg, '');
        },
      },
    },
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import '~@/assets/style/index.scss';`,
      },
      less: {
        lessOptions: { additionalData: `@import '~@/assets/style/default.less';`,
          javascriptEnabled: true,
          modifyVars: {
            'heading-color': '#bfbfbf',
            // 'component-background': '#212739'
          },
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = '流程引擎工作台';
      return args;
    });
    config.module
      .rule('bpmnlint')
      .test(/\.bpmnlintrc$/)
      .use('bpmnlint-loader')
      .loader('bpmnlint-loader')
      .end();
    config.module
      .rule('fonts')
      .use('url-loader')
      .loader('url-loader')
      .options({})
      .end();
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .options({})
      .end();
    config.module.rule('vue').use('vue-loader').loader('vue-loader').end();
    // config.module.rule('css').test(/\.less$/).use('less-loader').loader('less-loader').end()
  },
};
