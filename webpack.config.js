var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: ['webpack/hot/dev-server', './src/logic/main'],
  output: {
    path: './app',
    filename: 'logic/main.js'       
  },
  resolve: {
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee-loader' },
      { test: /\.jade$/, loader: 'jade-loader' },
      { test: /\.scss$/, loader: 'sass-loader' }
    ]
  },
  resolve: {
    root: [path.join(__dirname, "app/lib/bower")],
    extensions: ['', '.js', '.json', '.coffee'] 
  },
  plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    ),
    new webpack.IgnorePlugin(new RegExp("^(nw.gui|fs)$"))
  ],
  devServer: {
    contentBase: "./app",
    port: 5000
  }
};