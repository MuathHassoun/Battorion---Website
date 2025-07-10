const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public/assets', to: 'assets' },
        { from: 'public/css', to: 'css' },
        { from: 'public/html', to: 'html' },
        { from: 'public/img', to: 'img' },
        { from: 'public/js/vendor', to: 'js/vendor' },
      ],
    }),
  ],
});
