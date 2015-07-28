########################################
# General init
########################################

window.nw = false

if require?
  gui = require "nw.gui"

  window.nw = gui?

  win = gui.Window.get()
  menu = new gui.Menu type: "menubar"
  menu.createMacBuiltin "Hida"
  win.menu = menu

########################################
# Angular
########################################

angular.module "hida", [ 'ui.router', 'ui.bootstrap' ]

.config ($stateProvider, $urlRouterProvider) ->
  $stateProvider
  .state 'main',
    abstract: true
    templateUrl: 'parts/main.html'
    controller: 'MainController'
  .state 'main.home',
    url: '/home'
    templateUrl: 'parts/home.html'
    controller: 'HomeController'
  .state 'main.hida',
    url: '/hida'
    templateUrl: 'parts/hida.html'
    controller: 'HidaController'
  .state 'main.export',
    url: '/export'
    templateUrl: 'parts/export.html'
    controller: 'ExportController'

  $urlRouterProvider.otherwise "/home"

.run ($rootScope) ->
  $rootScope.temp = {}
  $rootScope.nw = window.nw