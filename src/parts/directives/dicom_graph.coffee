DefaultController = require '../../logic/controller'

module.exports = (module) ->

  module.directive 'dicomGraph', ->
    restrict: 'E'
    scope: 
      bridge: '='
    template: """
      <div class="dicom-graph-dir">
        <div class="lines"></div>
        <div class="info">
          <table>
            <tr ng-repeat="item in ctrl.hovered">
              <td>
                <div ng-style="{'background': item.color}" class="color"></div>
              </td>
              <td>{{item.value}}</td>
            </tr>
          </table>
        </div>
      </div>
    """
    link: (scope, element) -> scope.ctrl.link element

    controller: ($scope, $rootScope) ->

      new class DicomGraphController extends DefaultController

        ###########################
        # Constructor & init      #
        ###########################

        constructor: ->
          super $scope, $rootScope
          @hovered = []

          @bridge = @scope.bridge
              
        ###########################
        # Methods                 #
        ###########################

        link: (@$directive_element) => @create()

        create: =>
          require.ensure [], =>
            @$graph_element = @$directive_element.find('.lines')
            @graph_element = @$graph_element[0]

            @chart?.destroy()
            @chart = require('c3').generate
              bindto: @graph_element
              data:
                columns: [ ]
                onmouseover: @onMouseOverData
              size:
                height: 150
                width: @$graph_element.width()
              axis:
                x: show: false
                y: show: false
              legend:
                show: false
              transition:
                duration: 0
              interaction:
                enabled: true
              onmouseout: @update

            @bridge.setGraph? @

        onMouseOverData: (item) =>
          @update item.index

        update: (index) =>
          # Get chart data
          data = @chart.data() 
          # Only calculate if there is data
          if data.length is 0
            @hovered = []
          else
            index = data[0].values.length - 1 if not index?

            colors = @chart.data.colors()
            @hovered = _.map data, (curve) ->
              color: colors[curve.id]
              value: _.round curve.values[index]?.value, 2
            @hovered = _.sortByOrder @hovered, 'value', 'desc'
          # Let angular know
          @scope.$apply()

        resize: (width) =>
          if width >= 200
            @chart?.resize
              height: 150
              width: width - 150

        addRoi: (roi, sums) =>
          sums.unshift roi.id
          @chart?.load columns: [ sums ]
          @update()

          # Set colors to reflect ROI
          colors = @chart.data.colors()
          roi.strokeColor = colors[roi.id]
          paper.view.draw()