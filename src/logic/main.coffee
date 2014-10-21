angular.module "hida", [ 'ui.router', 'inspinia' ]

.config ($stateProvider, $urlRouterProvider) ->
  $stateProvider
  .state "login",
    url: "/login"
    templateUrl: "parts/login.html"

  $urlRouterProvider.otherwise "/login"