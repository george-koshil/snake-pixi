// webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

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
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
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
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false, // This makes sure that TypeScript errors don't stop the build process
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
      logger: {
        infrastructure: 'silent', // Disable logging of errors to the console
        issues: 'silent',         // Disable logging of issues to the console
      },
    }),
  ]
};
