var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    main: ['webpack/hot/dev-server', './src/main'],
    roi_worker: './src/logic/dicom/roi'
  },
  output: {
    path: './app',
    filename: 'bundle/[name].bundle.js',
    chunkFilename: 'bundle/[id].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'html'
      }, {
        test: /\.coffee$/,
        loader: 'ng-annotate!coffee'
      }, {
        test: /\.scss$/,
        loader: 'style!css!sass'
      }, {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?name=bundle/assets/fonts/[hash].[ext]&limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?name=bundle/assets/fonts/[hash].[ext]&limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?name=bundle/assets/fonts/[hash].[ext]&limit=10000&mimetype=application/octet-stream'
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file?name=bundle/assets/fonts/[hash].[ext]'
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?name=bundle/assets/fonts/[hash].[ext]&limit=10000&mimetype=image/svg+xml'
      }, {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url?name=bundle/assets/images/[hash].[ext]&limit=10000'
      }
    ]
  },
  resolve: {
    root: [path.join(__dirname, 'bower_components')],
    extensions: ['', '.js', '.json', '.coffee'] 
  },
  // devtool: 'eval-cheap-module-source-map', // Disabled because nw.js dev tools can't handle the large sourcemaps
  devServer: {
    contentBase: './app',
    port: 5000
  }
};