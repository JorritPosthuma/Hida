module.exports = (module) ->

  module.config ($stateProvider, $urlRouterProvider) ->
    $stateProvider
    .state 'main',
      abstract: true
      template: require '../parts/main.html'
      controller: 'MainController'
    .state 'main.home',
      url: '/home'
      template: require '../parts/home.html'
      controller: 'HomeController'
    .state 'main.hida',
      url: '/hida'
      template: require '../parts/hida.html'
      controller: 'HidaController'

    $urlRouterProvider.otherwise "/home"

  module.run ($rootScope) ->
    $rootScope.temp = {}
    $rootScope._ = _
    $rootScope.nw = global.nw?
