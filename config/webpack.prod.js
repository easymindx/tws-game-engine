// production config
const paths = require('./paths');
const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'production',
  output: {
    filename: 'js/bundle.[contenthash].min.js',
    path: paths.build,
    publicPath: '/',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: paths.public,
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
  ],
  devtool: 'source-map',
});
