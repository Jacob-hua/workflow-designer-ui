module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      "import",
      {
        "libraryName": "ant-design-vue",
        "styleLibraryName": "es",
        "style": true
      },
      'ant-design-vue'
    ],
    [
      "import",
      {
        "libraryName": "@formily/antdv",
        "libraryDirectory": "esm",
        "style": true
      },
      "@formily/antdv"
    ]
  ]
}
