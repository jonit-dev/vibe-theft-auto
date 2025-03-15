const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: ['reflect-metadata', './src/index.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, 'postcss.config.cjs'),
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@ui-components': path.resolve(__dirname, 'src/ui/components'),
      '@game-components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/ui/pages'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@scenes': path.resolve(__dirname, 'src/scenes'),
      '@ui': path.resolve(__dirname, 'src/ui'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: true,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/fonts',
          to: 'fonts',
        },
        {
          from: 'public/images',
          to: 'images',
        },
      ],
    }),
  ],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    runtimeChunk: 'single',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    historyApiFallback: true,
    compress: true,
    port: 9000,
    open: true,
    hot: true,
  },
  devtool: 'source-map',
};
