const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:'./',
  chainWebpack: config => {
    config
        .plugin('html')
        .tap(args => {
          args[0].title= '36助手'
          return args
        })
  }
})
