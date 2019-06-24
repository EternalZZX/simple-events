const path = require('path');
const utils = require('./webpack.utils');
const config = require('./config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const safeParser = require('postcss-safe-parser');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const env = process.env.NODE_ENV || 'development';
const isDev = env !== 'production';
const baseDir = path.join(__dirname, '..');

const getPluginConfig = event => {
  return isDev ? [
    new HtmlWebpackPlugin({
      filename: `${event.entryFileName}.html`,
      template: `${event.entryFileName}.ejs`,
      inject: true
    })
  ] : [
    new HtmlWebpackPlugin({
      filename: `${event.entryFileName}.html`,
      template: `${event.entryFileName}.ejs`,
      inject: true,
      minify: config.htmlmin,
      chunksSortMode: 'dependency'
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        parser: safeParser
      }
    }),
    new ExtractTextPlugin({
      filename: `${event.entryFileName}.[hash:8].css`,
      allChunks: true
    })
  ]; 
};

module.exports = event => ({
  context: path.resolve(baseDir, `${event.relEventDir}`),
  mode: env,
  output: {
    filename: `${event.entryFileName}.[hash:8].js`
  },
  resolve: {
    extensions: [
      '.js', '.vue', '.css', '.scss',
      '.sass', '.less', '.png', '.json'
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'statics': path.join(baseDir, 'statics'),
      'styles': path.join(baseDir, 'common/styles'),
      '@': path.join(baseDir, 'common')
    }
  },
  module: {
    rules: [{
      test: /\.ejs$/,
      loader: 'ejs-compiled-loader'
    }, {
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules\/(?!(dom7|ssr-window|split-on-first|query-string|strict-uri-encode|swiper)\/).*/
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: '[name].[hash:8].[ext]'
      }
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: '[name].[hash:8].[ext]'
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: '[name].[hash:8].[ext]'
      }
    },
    ...utils.styleLoaders({
      sourceMap: isDev,
      extract: !isDev,
      usePostCSS: true,
      usePxtorem: event.relEventDir.endsWith('mobile') || event.relEventDir.endsWith('-m/web')
    })]
  },
  plugins: [
    new VueLoaderPlugin(),
    ...getPluginConfig(event)
  ]
});
