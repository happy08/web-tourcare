import vue from 'vue'

const requireComponent = require.context( // webpack的api，匹配文件
    './_global', // 当前目录下的文件 相对路径)
    true, // 查子文件
    /index.vue$/ // 匹配方式正则表达式，只查看后缀为.vue的文件
)
// 循环获取到的文件，可在循环时处理文件名
requireComponent.keys().forEach((fileName) => {
    // 获取组件配置(组件模板)
    const componentConfig = requireComponent(fileName)
    // 将被注册的组件名字
    const componentName = fileName
        //.replace(/^\.\/_/, '')
        //.replace(/\.\w+$/, '')
        .replace('/index.vue', '')
        .replace(/^([^s]*)\//, '')
        .replace('_', '-')
        //.split('./')
        .split()
        .join('')
    
    //console.log(`cy-${componentName}`, '基础组件')
    // 组件全局注册
    vue.component(`cy-${componentName}`, componentConfig.default || componentConfig)
})
