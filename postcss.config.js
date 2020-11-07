module.exports = { 
    plugins: {
      'autoprefixer': {
        overrideBrowserslist: [
          "Android 4.1",
          "iOS 7.1",
          "Chrome > 31",
          "ff > 31",
          "ie >= 9"
        ]
      },
      'postcss-pxtorem': {
        rootValue: 37.5,//
        selectorBlackList  : [], // 忽略转换正则匹配项
        propList: ['*']
      }
    }
}
