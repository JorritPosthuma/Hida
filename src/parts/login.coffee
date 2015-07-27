DefaultController = require '../logic/controller'

module.exports = (angular) ->

  angular.controller 'LoginController', ($scope, $rootScope) ->
    new class extends DefaultController

      ###########################
      # Instance variables      #
      ###########################

      ###########################
      # constructor & init      #
      ###########################

      constructor: ->
        super $scope, $rootScope

      ###########################
      # Methods                 #
      ###########################