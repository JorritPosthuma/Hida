module = angular.module 'hida'
module.controller 'HomeController', ($scope, $rootScope, $timeout) ->

  new class extends DefaultController

    ###########################
    # constructor             #
    ###########################

    constructor: ->
      super $scope, $rootScope