module = angular.module 'hida'

module.directive 'dicomViewer', ->
  restrict: 'E'
  scope: 
    binding: '='
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
        @viewer.apply = => @scope.$apply()

      ###########################
      # Linker                  #
      ###########################

      link: (element) =>
        @viewer.link element
        @scope.binding = @viewer

        if window.nw
          @viewer.image [ "/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/HIDADYNFASE1/1.2.752.37.1.1.3407820023.6.166606920130905" ]