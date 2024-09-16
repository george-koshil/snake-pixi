const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    client: {
      overlay: false, // Disable error overlay in the browser
    },
    static: './dist',
    port: 8080,
    open: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Обробка тільки .js файлів
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js'] // Видаляємо .ts, оскільки TypeScript більше не використовується
  },
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Snake Game',
      template: 'public/index.html'
    })
  ]
};
