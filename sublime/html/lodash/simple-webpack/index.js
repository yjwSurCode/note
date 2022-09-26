// class Compiler {
//     constructor(options) {
//         // webpack 配置
//         const { entry, output } = options
//         // 入口
//         this.entry = entry
//         // 出口
//         this.output = output
//         // 模块
//         this.modules = []
//     }
//     // 构建启动
//     run() { }

//     // 重写 require函数,输出bundle
//     generate() { }
// }

const { resolve } = require('path')
const Compiler = require('./compiler')
const defaultConfig = require('./webpack.config') // 默认配置
const customConfig = require(resolve('./x.config.js')) // 加载个人项目配置，这里约定配置文件为 x.config.js

const config = { ...defaultConfig, ...customConfig }

// 开启 xwebpack 打包
new Compiler(config).run()




