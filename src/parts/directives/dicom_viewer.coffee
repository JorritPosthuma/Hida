DefaultController = require '../../logic/controller'
DicomViewer = require '../../logic/dicom/viewer'

module.exports = (module) ->
  module.directive 'dicomViewer', ->
    restrict: 'E'
    scope: 
      bridge: '='
    template: require "./dicom_viewer.html"
    link: (scope, element) -> scope.ctrl.link element
    controller: ($scope, $rootScope, $timeout) ->

      new class DicomViewerDirective extends DefaultController

        ###########################
        # Constructor & init      #
        ###########################

        constructor: ->
          super $scope, $rootScope
          @bridge = @scope.bridge
          @viewer = new DicomViewer
          @viewer.on 'update', -> $timeout()
          @details = false
          @warnings = []

        ###########################
        # Linker                  #
        ###########################

        link: (element) =>
          @viewer.link element
          @bridge.setViewer? @

        showInfo: =>
          @details = true
          @viewer.allowScroll = true

        showImage: =>
          @details = false
          @viewer.allowScroll = false

        addWarning: (message) =>
          @warnings.push message