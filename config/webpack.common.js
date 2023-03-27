// shared config (dev and prod)
const paths = require('./paths');
const { ProvidePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './index.tsx',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      cannon: paths.cannon,
      photon: paths.photon,
    },
    plugins: [new TsconfigPathsPlugin()],
  },
  context: paths.src,
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
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: paths.public + '/index.html',
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
