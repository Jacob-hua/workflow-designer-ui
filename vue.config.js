module.exports = {
  publicPath: "./",
  runtimeCompiler: true,
  devServer: {
    proxy: {
      "": {
        // target: "http://192.100.8.208:8060",
        // target: "http://192.100.8.80:8060",
        target: "http://k8s.isiact.com/workflow-runtime-service",
        changeOrigin: true, //是否允许跨域
      },
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("bpmnlint")
      .test(/\.bpmnlintrc$/)
      .use("bpmnlint-loader")
      .loader("bpmnlint-loader")
      .end();
  },
};
