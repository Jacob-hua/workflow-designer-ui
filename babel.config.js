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
