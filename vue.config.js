module.exports = {
    publicPath: './',
    devServer: {
      proxy: {
        "": {
          target: "http://192.100.8.208:8060",
          // target: "http://192.100.8.80:8060",
          changeOrigin: true, //是否允许跨域
        }
      }
    },
}
