module = angular.module 'hida'
module.controller 'ExportController', ($scope, $rootScope) ->

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