module = angular.module 'hida'
module.controller 'NavController', ($scope, $rootScope, $state) ->

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

    open: =>
      file = $('#file')
      file.change -> 
        $rootScope.images = $(@).val().split ';'
        $state.go 'main.home'
      file.click()
      return false