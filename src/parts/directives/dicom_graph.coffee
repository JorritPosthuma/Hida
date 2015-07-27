DefaultController = require '../../logic/controller'

module.exports = (module) ->

  module.directive 'dicomGraph', ->
    restrict: 'E'
    scope: 
      controls: '='
    template: '<div></div>'
    link: (scope, element) -> scope.ctrl.link element

    controller: ($scope, $rootScope) ->

      new class extends DefaultController

        ###########################
        # Constructor & init      #
        ###########################

        constructor: ->
          super $scope, $rootScope
              
        ###########################
        # Methods                 #
        ###########################

        link: (@$element) =>
          @element = @$element.find('div')[0]
          @scope.controls = @
          @chart = c3.generate
            bindto: @element
            data:
              columns: [ ]
            size:
              height: 150
              width: 590
            axis:
              x: show: false
              y: show: false
            legend:
              show: false
            transition:
              duration: 0
            interaction:
              enabled: false

        addRoi: (roi) =>
          roi.data.sums.unshift roi.id
          @chart.load columns: [ roi.data.sums ]