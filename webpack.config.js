'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let sourceDir = path.join(__dirname, 'client/app');
let distDir = path.join(__dirname, 'client/dist');
let entry = {};
fs.readdirSync(sourceDir).forEach(file => {
  let extname = path.extname(file);
  if (extname === '.js') {
    let basename = path.basename(file, extname);
    entry[basename] = ['babel-polyfill', 'babel-regenerator-runtime', path.join(sourceDir, file)];
  }
});

let production = process.env.NODE_ENV === 'production';

module.exports = {
  entry: entry,
  output: {
    path: distDir,
    publicPath: '/dist/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loaders: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]?[hash]'
            }
          }/*,
          {
            loader: 'image-webpack-loader',
            query: {
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 4,
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              }
            }
          }*/
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'fonts/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.scss/,
        loaders: ExtractTextPlugin.extract(['css-loader?sourceMap', 'postcss-loader', 'sass-loader'])
      },
      {
        test: /\.css/,
        loaders: ExtractTextPlugin.extract(['css-loader?sourceMap', 'postcss-loader'])
      }
    ]
  },
  devtool: production ? 'source-map' : 'inline-source-map'
};

let chunks = _.reject(_.keys(entry), name => { return name === 'style'; });

module.exports.plugins = [
  new ExtractTextPlugin('styles/[name].css'),
  new webpack.ProvidePlugin({
    $: 'jquery',
    '$.jQuery': 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery'
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    chunks: chunks,
    minChunks (module, count) {
      return count > 1 || isVendor(module);
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common.vendor',
    chunks: ['common'],
    minChunks (module) {
      return isVendor(module);
    }
  })
];

function isVendor(module) {
  // any required modules inside node_modules are extracted to vendor
  return (
    module.resource &&
    /\.js$/.test(module.resource) &&
    module.resource.indexOf(
      path.join(__dirname, 'node_modules')
    ) === 0
  );
}

if (production) {
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
}