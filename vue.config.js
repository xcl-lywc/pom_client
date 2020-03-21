module.exports = {
  lintOnSave: false,
  outputDir: "dist",
  assetsDir: "assets",
  devServer: {
    proxy: { 
      '/api': {
        target: 'http://192.168.31.9:10020/api/',
        ws:true, // 为true表示可以给webscoket使用
        pathRewrite: {'^/api' : ''}, //重定向
        secure: false
      }, 
      '/UEApi': {
        target: 'http://192.168.31.8:20000', 
        pathRewrite: {'^/UEApi' : ''}, //重定向
        secure: false
      }, 
      '/file': {
        target: 'http://192.168.31.9/resoure', 
        pathRewrite: {'^/file' : ''}, //重定向
        secure: false
      }, 
      
    }
  } 
}