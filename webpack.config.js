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
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './src/index.html',
      inject: 'head'
    })
  ],
  mode: 'development'
}
