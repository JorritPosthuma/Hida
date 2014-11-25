module = angular.module 'hida'

module.directive 'dicomHidaControls', ->
  restrict: 'E'
  scope: 
    binding: '='
  templateUrl: "parts/directives/dicom_hida_controls.html"

  controller: ($scope, $rootScope, $state) ->

    new class extends DefaultController

      ###########################
      # Constructor & init      #
      ###########################

      constructor: ->
        super $scope, $rootScope

        @scope.$watch 'binding', (viewer) =>
          if viewer?
            if @root.temp.hida_reader?
              @start viewer, @root.temp.hida_reader
              delete @root.temp.hida_reader
            else $state.go 'main.home'

      start: (@viewer, @reader) =>
        @merged = false

        @viewer.read @reader
        @hida = new Hida @viewer

      ###########################
      # Methods                 #
      ###########################

      merge: =>
        @merged = true
        @unmerged_reader = @reader
        @reader = @hida.reverseMerge @unmerged_reader
        @viewer.read @reader

      unmerge: =>
        @merged = false
        @reader = @unmerged_reader
        @viewer.read @reader