module = angular.module 'hida'

module.directive 'dicomControls', ->
  restrict: 'E'
  scope: 
    binding: '='
  templateUrl: "parts/directives/dicom_controls.html"
  link: (scope) ->
    scope.binding = scope.ctrl
  controller: ($scope, $rootScope) ->

    new class extends DefaultController

      ###########################
      # Constructor & init      #
      ###########################

      constructor: ->
        super $scope, $rootScope

      ###########################
      # Methods                 #
      ###########################

      register: (@viewer) =>

      load: =>
        file = $('#file')
        viewer = @viewer
        file.change -> viewer.image $(@).val().split ';'
        file.click()
        return false

      window: => @viewer.enableWindow()

      draw: => @viewer.enableDraw()

      edit: => @viewer.enableEdit()