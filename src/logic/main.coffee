angular.module "hida", [ 'ui.router', 'inspinia' ]

.config ($stateProvider, $urlRouterProvider) ->
  $stateProvider
  .state "main",
    abstract: true
    templateUrl: "parts/main.html"
  .state "main.home",
    url: "/home"
    templateUrl: "parts/home.html"
  .state "login",
    url: "/login"
    templateUrl: "parts/login.html"

  $urlRouterProvider.otherwise "/home"