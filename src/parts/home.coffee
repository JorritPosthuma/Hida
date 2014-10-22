module = angular.module 'hida'
module.controller 'HomeController', ($scope, $rootScope) ->

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