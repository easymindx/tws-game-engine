// shared config (dev and prod)
const { resolve } = require('path');
const { ProvidePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: './index.tsx',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      cannon: resolve(__dirname, '../../src/lib/cannon/cannon.js'),
      photon: resolve(__dirname, '../../src/lib/photon/photon.js'),
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
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
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
  plugins: [
    new HtmlWebpackPlugin({
      template: '../public/index.html',
      inject: 'head', // Inject the CSS into the head of the HTML file
      minify: false, // Disable minification to make debugging easier
    }),
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
      chunkFilename: '[id].css',
    }),
    new ProvidePlugin({
      React: 'react',
    }),
  ],
};
