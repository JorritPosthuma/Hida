module = angular.module 'hida'
module.controller 'HomeController', ($scope, $rootScope, $timeout) ->

  new class extends DefaultController

    ###########################
    # Instance variables      #
    ###########################

    images: ''

    ###########################
    # constructor             #
    ###########################

    constructor: ->
      super $scope, $rootScope

      $rootScope.$watch 'images', (images) =>
        @images = images

    ###########################
    # Methods                 #
    ###########################