DefaultController = require '../logic/controller'

module.exports = (angular) ->

  angular.controller 'HomeController', ($scope, $rootScope, $timeout) ->

    new class extends DefaultController

      ###########################
      # constructor             #
      ###########################

      constructor: ->
        super $scope, $rootScope