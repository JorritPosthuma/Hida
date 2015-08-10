DefaultController = require '../../logic/controller'

module.exports = (module) ->

  module.directive 'dicomHidaAnalysis', ->
    restrict: 'E'
    scope: 
      bridge: '='
    template:  require "./dicom_hida_analysis.html"
    controller: ($scope, $rootScope) ->

      new class DicomHidaAnalysisController extends DefaultController

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
            .then (result) ->
              console.info result