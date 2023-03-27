// production config
const { merge } = require('webpack-merge');
const { resolve } = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  mode: 'production',
  output: {
    filename: 'js/bundle.[contenthash].min.js',
    path: resolve(__dirname, '../../dist'),
    publicPath: '/',
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: '../public/assets', to: 'assets' }],
    }),
  ],
  devtool: 'source-map',
});
