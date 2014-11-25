module = angular.module 'hida'

module.directive 'dicomControls', ->
  restrict: 'E'
  scope: 
    binding: '='
  templateUrl: "parts/directives/dicom_controls.html"

  controller: ($scope, $rootScope) ->

    new class extends DefaultController

      ###########################
      # Constructor & init      #
      ###########################

      constructor: ->
        super $scope, $rootScope

        @scope.$watch 'binding', (@viewer) =>
          console.info @viewer

      ###########################
      # Methods                 #
      ###########################

      load: =>
        file = $('#file')
        viewer = @viewer
        file.change -> viewer.image $(@).val().split ';'
        file.click()
        return false

      hida: => @viewer.startHida()

      window: => @viewer.enableWindow()

      draw: => @viewer.enableDraw()

      edit: => @viewer.enableEdit()