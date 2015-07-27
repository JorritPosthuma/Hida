DefaultController = require '../../logic/controller'

module.exports = (module) ->

  module.directive 'dicomControls', ->
    restrict: 'E'
    scope: 
      viewer: '='
    template: require "./dicom_controls.jade"

    controller: ($scope, $rootScope, $state) ->

      new class extends DefaultController

        ###########################
        # Constructor & init      #
        ###########################

        constructor: ->
          super $scope, $rootScope

          @scope.$watch 'viewer', (viewer) =>
            if viewer?
              @viewer = viewer
              
        ###########################
        # Methods                 #
        ###########################

        load: =>
          file = $('#file')
          viewer = @viewer
          file.change -> viewer.image $(@).val().split ';'
          file.click()
          return false

        hida: =>
          if @viewer.reader?
            @root.temp.hida_reader = @viewer.reader
            $state.go 'main.hida'

        window: => @viewer.enableWindow()
        draw:   => @viewer.enableDraw()
        edit:   => @viewer.enableEdit()