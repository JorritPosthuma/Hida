module = angular.module 'hida'
module.controller 'HomeController', ($scope, $rootScope, $timeout) ->

  new class extends DefaultController

    ###########################
    # Instance variables      #
    ###########################

    ###########################
    # constructor             #
    ###########################

    constructor: ->
      super $scope, $rootScope

    ###########################
    # Methods                 #
    ###########################