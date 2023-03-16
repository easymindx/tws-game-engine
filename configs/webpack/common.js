// shared config (dev and prod)
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: './index.tsx',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      cannon: resolve(__dirname, '../../src/lib/cannon/cannon.js'),
    },
    plugins: [new TsconfigPathsPlugin()],
  },
  context: resolve(__dirname, '../../src'),
  module: {
    rules: [
      {
        test: [/\.jsx?$/, /\.tsx?$/],
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/,
        resourceQuery: { not: [/url/] },
        use: [{ loader: '@svgr/webpack', options: { svgo: false } }],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: '../public/index.html' })],
};
