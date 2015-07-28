module = angular.module 'hida'

module.directive 'dicomHidaAnalysis', ->
  restrict: 'E'
  scope: 
    controls: '='
  templateUrl: "parts/directives/dicom_hida_analysis.html"
  controller: ($scope, $rootScope, $timeout) ->

    new class extends DefaultController

      ###########################
      # Constructor & init      #
      ###########################

      constructor: ->
        super $scope, $rootScope