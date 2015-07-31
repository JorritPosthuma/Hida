########################################
# General init
########################################

if global?.require?
  global.nw = global.require 'nw.gui'

  menu = new global.nw.Menu type: "menubar"
  menu.createMacBuiltin "Hida"
  global.nw.Window.get().menu = menu

########################################
# Angular
########################################

require '../style/main.scss'

require 'angular'

require 'ui-router'
require 'angular-bootstrap'

module = angular.module "hida", [ 'ui.router', 'ui.bootstrap' ]

require('./filters')(module)

require('../parts/directives/dicom_controls')(module)
require('../parts/directives/dicom_graph')(module)
require('../parts/directives/dicom_hida_controls')(module)
require('../parts/directives/dicom_hida_analysis')(module)
require('../parts/directives/dicom_viewer')(module)

require('../parts/export')(module)
require('../parts/hida')(module)
require('../parts/home')(module)
require('../parts/login')(module)
require('../parts/main')(module)
require('../parts/nav')(module)

main_sub_views = 
  nav:
    controller: 'NavController'
    template: require '../parts/nav.jade'
  top:
    template: require '../parts/top.jade'

module.config ($stateProvider, $urlRouterProvider) ->
  $stateProvider
  .state 'main',
    abstract: true
    template: require '../parts/main.jade'
    controller: 'MainController'
  .state 'main.home',
    url: '/home'
    views: _.extend main_sub_views,
      main:
        template: require '../parts/home.jade'
        controller: 'HomeController'
  .state 'main.hida',
    url: '/hida'
    views: _.extend main_sub_views,
      main:
        template: require '../parts/hida.jade'
        controller: 'HidaController'
  .state 'main.export',
    url: '/export'
    views: _.extend main_sub_views,
      main:
        template: require '../parts/export.jade'
        controller: 'ExportController'

  $urlRouterProvider.otherwise "/home"

.run ($rootScope) ->
  $rootScope.temp = {}