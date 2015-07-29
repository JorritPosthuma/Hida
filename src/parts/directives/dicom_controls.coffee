DefaultController = require '../../logic/controller'

module.exports = (module) ->

  module.directive 'dicomControls', ->
    restrict: 'E'
    scope: 
      bridge: '='
    template: require "./dicom_controls.jade"

    controller: ($scope, $rootScope, $state) ->

      new class DicomControlsController extends DefaultController

        ###########################
        # Constructor & init      #
        ###########################

        constructor: ->
          super $scope, $rootScope

          # Make myself known to bridge
          @bridge = @scope.bridge
          @bridge.setControls @
              
        ###########################
        # Methods                 #
        ###########################

        load: =>
          file = $('#file')
          viewer = @bridge.viewerDir.viewer
          file.change -> viewer.image $(@).val().split ';'
          file.click()
          return false

        hida: =>
          if @bridge.viewerDir.viewer.reader?
            @root.temp.hida_reader = @bridge.viewerDir.viewer.reader
            $state.go 'main.hida'

        window: => @bridge.viewerDir.viewer.enableWindow()
        draw:   => @bridge.viewerDir.viewer.enableDraw()
        edit:   => @bridge.viewerDir.viewer.enableEdit()