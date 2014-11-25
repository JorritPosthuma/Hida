module = angular.module 'hida'
module.controller 'HidaController', ($scope, $rootScope, $timeout) ->

  new class extends DefaultController

    ###########################
    # constructor             #
    ###########################

    constructor: ->
      super $scope, $rootScope
