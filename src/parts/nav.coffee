DefaultController = require '../logic/controller'

module.exports = (angular) ->

  angular.controller 'NavController', ($scope, $rootScope, $state) ->
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