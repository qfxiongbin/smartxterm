const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    target: 'electron-renderer',
    externals: {
      'fs': 'require("fs")',
    }
  },
  productionSourceMap: true,
	pluginOptions: {
		electronBuilder: {
			nodeIntegration: true,
			externals:['node-pty']
		}
	}
})