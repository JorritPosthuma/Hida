module = angular.module 'hida'

module.directive 'dicomHidaControls', ->
  restrict: 'E'
  scope: 
    bridge: '='
  templateUrl: "parts/directives/dicom_hida_controls.html"

  controller: ($scope, $rootScope) ->

    new class extends DefaultController

      ###########################
      # Constructor & init      #
      ###########################

      constructor: ->
        super $scope, $rootScope

        # Init
        @merged = false

        # Make myself known to bridge
        @bridge = @scope.bridge
        @bridge.setControls @

      ###########################
      # Methods                 #
      ###########################

      merge: =>
        @merged = true
        @unmerged_reader = @bridge.viewerDir.viewer.reader
        reversed = @bridge.hida.reverseMerge @bridge.viewerDir.viewer.reader
        @bridge.viewerDir.viewer.read reversed

      unmerge: =>
        @merged = false
        @bridge.viewerDir.viewer.read @unmerged_reader

      window: => @bridge.viewerDir.viewer.enableWindow()
      draw:   => @bridge.viewerDir.viewer.enableDraw()
      edit:   => @bridge.viewerDir.viewer.enableEdit()