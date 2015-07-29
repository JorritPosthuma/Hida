########################################
# General init
########################################

window.nw = false

# if require?
#   gui = require "nw.gui"

#   window.nw = gui?

#   win = gui.Window.get()
#   menu = new gui.Menu type: "menubar"
#   menu.createMacBuiltin "Hida"
#   win.menu = menu

########################################
# Angular
########################################

require 'angular'

require 'ui-router'
require 'angular-bootstrap'

module = angular.module "hida", [ 'ui.router', 'ui.bootstrap' ]

require('./filters')(module)

require('../parts/directives/dicom_controls')(module)
require('../parts/directives/dicom_graph')(module)
require('../parts/directives/dicom_hida_controls')(module)
require('../parts/directives/dicom_viewer')(module)

require('../parts/export')(module)
require('../parts/hida')(module)
require('../parts/home')(module)
require('../parts/login')(module)
require('../parts/main')(module)
require('../parts/nav')(module)

module.config ($stateProvider, $urlRouterProvider) ->
  $stateProvider
  .state 'main',
    abstract: true
    template: require '../parts/main.jade'
    controller: 'MainController'
  .state 'main.home',
    url: '/home'
    template: require '../parts/home.jade'
    controller: 'HomeController'
  .state 'main.hida',
    url: '/hida'
    template: require '../parts/hida.jade'
    controller: 'HidaController'
  .state 'main.export',
    url: '/export'
    template: require '../parts/export.jade'
    controller: 'ExportController'

  $urlRouterProvider.otherwise "/home"

.run ($rootScope) ->
  $rootScope.temp = {}