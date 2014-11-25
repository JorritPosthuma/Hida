module = angular.module 'hida'

module.directive 'dicomHidaControls', ->
  restrict: 'E'
  scope: 
    binding: '='
  templateUrl: "parts/directives/dicom_hida_controls.html"

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
            if @root.temp.hida_reader?
              @viewer.read @root.temp.hida_reader
              delete @root.temp.hida_reader
            else $state.go 'main.home'

      ###########################
      # Methods                 #
      ###########################