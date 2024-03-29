/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const autoprefixer = require('autoprefixer');
const postcssEasingGradients = require('postcss-easing-gradients');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const DEV_MODE = process.env.NODE_ENV === 'dev'

module.exports = {
  devtool: DEV_MODE ? 'eval' : 'source-map',
  entry: {
    main: './src/main.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/scripts/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      DEV_MODE
        ? {
            test: /\.scss/,
            use: [
              'style-loader',
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  includePaths: [
                    path.resolve(__dirname, 'node_modules')
                  ],
                  plugins() {
                    return [
                      autoprefixer,
                      postcssEasingGradients,
                    ];
                  },
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true,
                  includePaths: [
                    path.resolve(__dirname, 'node_modules')
                  ],
                }
              },
            ]
          }
        : {
            test: /\.scss$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  includePaths: [
                    path.resolve(__dirname, 'node_modules')
                  ],
                  plugins() {
                    return [
                      autoprefixer,
                      postcssEasingGradients,
                    ];
                  },
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: false,
                  includePaths: [
                    path.resolve(__dirname, 'node_modules')
                  ],
                }
              },
            ]
          },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
              outputPath: 'assets/images/',
              publicPath: '../images/',
              name: '[name]-[hash:5].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 85
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: 85,
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              }
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new StyleLintPlugin(),
    new MiniCssExtractPlugin({
      filename: "assets/styles/[name].css",
      chunkFilename: "assets/styles/[id].css"
    }),
    new CopyWebpackPlugin([
      {
        from: 'previews/index.html',
        to:  path.resolve(__dirname, 'dist')
      },
      {
        from: path.resolve(__dirname, 'static'),
        to:  path.resolve(__dirname, 'dist/assets/static'),
        cache: DEV_MODE
      },
    ]),
    // compress images
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      cacheFolder: path.resolve('cache'),
    })
  ]
}
