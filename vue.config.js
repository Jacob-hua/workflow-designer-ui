module.exports = {
  publicPath: "./",
  runtimeCompiler: true,
  devServer: {
    proxy: {
      "": {
        // target: "http://192.100.8.208:8060",
        // target: "http://192.100.8.80:8060",
        target: "http://k8s.isiact.com/workflow-runtime-service",
        //target: "http://127.0.0.1:8060",
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
