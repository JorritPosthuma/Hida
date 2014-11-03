module = angular.module 'hida'
module.controller 'HomeController', ($scope, $rootScope, $timeout) ->

  new class extends DefaultController

    ###########################
    # Instance variables      #
    ###########################

    path: ''

    ###########################
    # constructor             #
    ###########################

    constructor: ->
      super $scope, $rootScope

      $rootScope.$watch 'image_path', (image_path) =>
        @path = image_path

    ###########################
    # Methods                 #
    ###########################