var path = require('path');
var webpack = require('webpack');

env = 'DEV' // Default
if (process.env.NODE_ENV) {
  env = process.env.NODE_ENV 
}

/**************************************
 * Main config
 **************************************/

config = {
  entry: {
    main: ['./src/main'],
    roi: ['./src/logic/dicom/roi']
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
  }
};

/**************************************
 * DEV additions
 **************************************/

if (env == 'DEV') {
  // config.devtool = 'eval-cheap-module-source-map';
  config.devServer = {
    contentBase: './app',
    port: 5000
  };
  config.entry.main.unshift('webpack/hot/dev-server');
}

/**************************************
 * Export
 **************************************/

module.exports = config