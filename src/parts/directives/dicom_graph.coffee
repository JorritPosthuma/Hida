DefaultController = require '../../logic/controller'

module.exports = (module) ->

  module.directive 'dicomGraph', ->
    restrict: 'E'
    scope: 
      bridge: '='
    template: '<div></div>'
    link: (scope, element) -> scope.ctrl.link element

    controller: ($scope, $rootScope) ->

      new class extends DefaultController

        ###########################
        # Constructor & init      #
        ###########################

        constructor: ->
          super $scope, $rootScope

          @bridge = @scope.bridge
              
        ###########################
        # Methods                 #
        ###########################

        link: (@$element) =>
          @element = @$element.find('div')[0]
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

          @bridge.setGraph @

        addRoi: (roi) =>
          roi.data.sums.unshift roi.id
          @chart.load columns: [ roi.data.sums ]