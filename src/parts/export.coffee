DefaultController = require '../logic/controller'

module.exports = (angular) ->

  angular.controller 'ExportController', ($scope, $rootScope) ->

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