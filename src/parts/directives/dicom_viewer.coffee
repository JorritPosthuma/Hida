module = angular.module 'hida'

module.directive 'dicomViewer', ->
  restrict: 'E'
  scope: 
    controls: '='
  templateUrl: "parts/directives/dicom_viewer.html"
  link: (scope, element) -> scope.ctrl.link element
  controller: ($scope, $rootScope, $timeout) ->

    new class extends DefaultController

      ###########################
      # Constructor & init      #
      ###########################

      constructor: ->
        super $scope, $rootScope

        @viewer = new DicomViewer
        @viewer.on 'update', -> $timeout()

      ###########################
      # Linker                  #
      ###########################

      link: (element) =>
        @viewer.link element
        @scope.controls = @viewer