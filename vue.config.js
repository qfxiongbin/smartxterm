const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    target: 'electron-renderer',
    externals: {
      'fs': 'require("fs")',
      // 这里可以添加更多的 Node.js 模块
    }
  }
})