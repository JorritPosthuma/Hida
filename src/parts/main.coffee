module = angular.module 'hida'
module.controller 'MainController', ($scope, $rootScope, $state) ->

  new class extends DefaultController

    ###########################
    # Instance variables      #
    ###########################

    ###########################
    # constructor & init      #
    ###########################

    constructor: ->
      super $scope, $rootScope

      $scope.$state = $state

    ###########################
    # Methods                 #
    ###########################

    open: =>
      file = $('#file')
      self = @
      file.change -> self.image $(@).val()
      file.click()
      return false