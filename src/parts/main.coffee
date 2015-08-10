DefaultController = require '../logic/controller'

module.exports = (angular) ->

  angular.controller 'MainController', ($scope, $rootScope, $state) ->
    $scope.$state = $state