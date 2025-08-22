const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'content-script': './src/content-script/index.js',
    'background': './background.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        // Chrome拡張として必要なファイル
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'background.js', to: 'background.js' },
        { from: 'popup.html', to: 'popup.html' },
        { from: 'popup.js', to: 'popup.js' },
        { from: 'options.html', to: 'options.html' },
        { from: 'options.js', to: 'options.js' },
        { from: 'assets', to: 'assets', noErrorOnMissing: true }
      ]
    })
  ],
  optimization: {
    minimize: false // 開発中はminifyしない
  }
};