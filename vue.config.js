module.exports = {
    publicPath: './',
    devServer: {
      proxy: {
        "": {
          target: "http://192.100.8.136:8060",
          changeOrigin: true, //是否允许跨域
        }
      }
    },
}
