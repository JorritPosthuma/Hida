var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    main: './src/main'
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
    root: [path.join(__dirname, 'app/lib/bower')],
    extensions: ['', '.js', '.json', '.coffee'] 
  },
  plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
    )
  ],
  // devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: './app',
    port: 5000
  }
};