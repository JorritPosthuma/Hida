angular.module "hida", [ 'ui.router', 'ui.bootstrap' ]

.config ($stateProvider, $urlRouterProvider) ->
  $stateProvider
  .state "main",
    abstract: true
    templateUrl: "parts/main.html"
    controller: "MainController"
  .state "main.home",
    url: "/home"
    templateUrl: "parts/home.html"
    controller: "HomeController"
  .state "main.export",
    url: "/export"
    templateUrl: "parts/export.html"
    controller: "ExportController"
  .state "login",
    url: "/login"
    templateUrl: "parts/login.html"

  $urlRouterProvider.otherwise "/home"

gui = require "nw.gui"

shortcut = new gui.Shortcut
  key: 'Ctrl+Q'
  active: gui.App.quit

gui.App.registerGlobalHotKey shortcut