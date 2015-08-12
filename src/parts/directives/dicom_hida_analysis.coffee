DefaultController = require '../../logic/controller'

module.exports = (module) ->

  module.directive 'dicomHidaAnalysis', ->
    restrict: 'E'
    scope: 
      bridge: '='
    template:  require "./dicom_hida_analysis.html"
    controller: ($scope, $rootScope, $timeout) ->

      new class DicomHidaAnalysisController extends DefaultController

        ###########################
        # Constructor & init      #
        ###########################

        constructor: ->
          super $scope, $rootScope

          @bridge = @scope.bridge
          @bridge.analysisDir = @

          @loading = false
          @weigth = ''
          @length = ''

        isValid: =>
          length = parseInt @length
          weigth = parseInt @weigth

          _.isFinite(length) and _.isFinite(weigth)

        analyse: =>
          if not @loading and @isValid()
            @loading = true

            $timeout =>
              @bridge.hida.analyse parseInt(@length), parseInt(@weigth)
              .then =>
                @bridge.controlsDir.unAnalyse()
                @loading = false
                $timeout()