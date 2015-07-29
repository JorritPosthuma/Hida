DefaultController = require '../../logic/controller'

module.exports = (module) ->
  module.directive 'dicomViewer', ->
    restrict: 'E'
    scope: 
      controls: '='
    template: "./dicom_viewer.jade"
    link: (scope, element) -> scope.ctrl.link element
    controller: ($scope, $rootScope, $timeout) ->

      new class extends DefaultController

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
          @bridge.setViewer @

        showInfo: =>
          @details = true
          @viewer.allowScroll = true

        showImage: =>
          @details = false
          @viewer.allowScroll = false

        addWarning: (message) =>
          @warnings.push message