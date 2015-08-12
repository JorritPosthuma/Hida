DefaultController = require '../../logic/controller'

module.exports = (module) ->

  module.directive 'dicomHidaControls', ->
    restrict: 'E'
    scope: 
      bridge: '='
    template: require "./dicom_hida_controls.html"

    controller: ($scope, $rootScope) ->

      new class extends DefaultController

        ###########################
        # Constructor & init      #
        ###########################

        constructor: ->
          super $scope, $rootScope

          # Init
          @merged = false
          @analysis = false

          # Make myself known to bridge
          @bridge = @scope.bridge
          @bridge.setControls? @

        ###########################
        # Methods                 #
        ###########################

        merge: =>
          # Set state to true
          @merged = true
          # Get viewer
          viewer = @bridge.viewerDir.viewer
          # Store original frames
          @unmerged_frames = viewer.reader.frames
          # Set new frames
          viewer.reader.frames = @bridge.hida.reverseMerge @unmerged_frames
          # Show view
          viewer.reread()

        unmerge: =>
          # Set state to false
          @merged = false
          # Get viewer
          viewer = @bridge.viewerDir.viewer
          # Restore frames
          viewer.reader.frames = @unmerged_frames
          # Show view
          viewer.reread()

        window: => @bridge.viewerDir.viewer.enableWindow()
        draw:   => @bridge.viewerDir.viewer.enableDraw()
        edit:   => @bridge.viewerDir.viewer.enableEdit()

        analyse:   => @analysis = true
        unAnalyse: => @analysis = false