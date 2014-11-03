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
      self = @
      file.change -> 
        $rootScope.image_path = $(@).val()
        $state.go 'main.home'
      file.click()
      return false