const path = require('path');
// webpack打包项目的 HtmlWebpackPlugin生成产出HTML文件 user-agent把浏览器的UserAgent变成一个对象
const htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/main.js',
  context: process.cwd(), // 上下文目录
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'monitor.js'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist') // devServer静态文件根目录
    },
    // mock数据
    onBeforeSetupMiddleware: function (devServer) {
      devServer.app.get('/success', function(req, res) {
        res.json({id: 1}); // 200
      })
      devServer.app.post('/error', function(req, res) {
        res.sendStatus(500); // 500
      })
    }
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './src/index.html',
      inject: 'head'
    })
  ],
  mode: 'development'
}
