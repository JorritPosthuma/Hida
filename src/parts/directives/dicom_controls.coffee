module = angular.module 'hida'

module.directive 'dicomControls', ->
  restrict: 'E'
  scope: 
    binding: '='
  templateUrl: "parts/directives/dicom_controls.html"

  controller: ($scope, $rootScope, $state) ->

    new class extends DefaultController

      ###########################
      # Constructor & init      #
      ###########################

      constructor: ->
        super $scope, $rootScope

        @scope.$watch 'binding', (viewer) =>
          if viewer?
            @viewer = viewer
            if @root.nw
              @viewer.image [ "/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/HIDADYNFASE1/1.2.752.37.1.1.3407820023.6.166606920130905" ]

      ###########################
      # Methods                 #
      ###########################

      load: =>
        file = $('#file')
        viewer = @viewer
        file.change -> viewer.image $(@).val().split ';'
        file.click()
        return false

      hida: =>
        if @viewer.reader?
          @root.temp.hida_reader = @viewer.reader
          $state.go 'main.hida'

      window: => @viewer.enableWindow()

      draw: => @viewer.enableDraw()

      edit: => @viewer.enableEdit()