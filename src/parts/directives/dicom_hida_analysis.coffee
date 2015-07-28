module = angular.module 'hida'

module.directive 'dicomHidaAnalysis', ->
  restrict: 'E'
  scope: 
    bridge: '='
  templateUrl: "parts/directives/dicom_hida_analysis.html"
  controller: ($scope, $rootScope) ->

    new class extends DefaultController

      ###########################
      # Constructor & init      #
      ###########################

      constructor: ->
        super $scope, $rootScope

        @bridge = @scope.bridge
        @bridge.analysisDir = @

        @weigth = ''
        @length = ''

      isValid: =>
        length = parseInt @length
        weigth = parseInt @weigth

        _.isFinite(length) and _.isFinite(weigth)

      analyse: =>
        if @isValid()
          @bridge.hida.analyse parseInt(@length), parseInt(@weigth)