gulp       = require "gulp"
gutil      = require "gulp-util"

path       = require 'path'
webpack    = require 'webpack'
server     = require 'webpack-dev-server'

notifier   = require "node-notifier"
$          = require("gulp-load-plugins")()

nw = './node_modules/.bin/nw '

paths =
  sass:   [ "./src/style/main.scss", "./src/parts/**/*.scss" ]
  coffee: [ "./src/logic/main.coffee", "./src/logic/**/*.coffee", "./src/**/*.coffee" ]
  jade:   [ "./src/**/*.jade" ]

handle_error = (e) ->
  notifier.notify
    title: 'Gulp Error'
    message: e.message

  gutil.log e
  gutil.beep()
  @emit 'end'

webpack.config = 
  entry: './src/logic/main'
  output:
    filename: './app/logic/main.js'
  resolve: {}
  module: loaders: [
    { test: /\.coffee$/, loader: 'coffee-loader' }
    { test: /\.jade$/, loader: 'jade-loader' }
    { test: /\.scss$/, loader: 'sass-loader' }
  ]
  resolve:
    root: [ path.join(__dirname, 'app/lib/bower') ]
    extensions: ['', '.js', '.json', '.coffee']
  plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin 'bower.json', [ 'main' ]
    )
  ]

handleWebpack = (done) ->
  (err, stats) ->
    throw new gutil.PluginError "webpack", err if err
    gutil.log "[webpack]", stats.toString colors: true
    done?()

gulp.task "wp", (done) ->
  webpack webpack.config
  .watch 100, handleWebpack()

gulp.task "default", [ "sass", "coffee", "jade" ]

gulp.task "run", [ "watch" ], $.shell.task [ nw + 'app' ]

gulp.task "rerun", [ "rewatch" ], $.shell.task [ nw + 'app' ]

gulp.task "build", [ "default" ], ->
  NWB = require 'nw-builder'

  builder = new NWB
    files: './app/**'
    platforms: [ 'osx', 'win' ]

  builder.on 'log',  console.log

  builder.build()
  .then -> console.log 'all done!'
  .catch (error) -> console.error error

gulp.task "sass", ->
  gulp.src [ "./src/style/main.scss" ]
  .pipe $.sourcemaps.init()
    .pipe $.sass()
    .on 'error', handle_error
  .pipe $.sourcemaps.write '.'
  .pipe gulp.dest "./app/css/"
  .pipe $.livereload()

gulp.task "coffee", ->
  gulp.src paths.coffee
  .pipe $.sourcemaps.init()
    .pipe $.coffee bare: true
    .on 'error', handle_error
    .pipe $.concat "main.js"
  .pipe $.sourcemaps.write '.'
  .pipe gulp.dest "./app/logic/"
  .pipe $.livereload()

gulp.task "jade", ->
  gulp.src paths.jade
  # .pipe $.sourcemaps.init()
    .pipe $.jade pretty: true
    .on 'error', handle_error
  # .pipe $.sourcemaps.write()
  .pipe gulp.dest "./app/"
  .pipe $.livereload()

gulp.task "livereload", ->
  $.livereload.listen()

gulp.task "server", ->
  restify = require "restify"
  server  = restify.createServer name: "When"
  port    = process.env.PORT || 3000

  server.listen port, ->
    console.log "#{server.name} listening at #{server.url}"

  server.get /.*/, restify.serveStatic
    directory: "./app"
    default: "index.html"

gulp.task "serve", [ "watch", "server"]

gulp.task "rewatch", [ "livereload" ], ->
  gulp.watch paths.sass,    ["sass"]
  gulp.watch paths.coffee,  ["coffee"]
  gulp.watch paths.jade,    ["jade"]

gulp.task "watch", [ "default", "rewatch" ]