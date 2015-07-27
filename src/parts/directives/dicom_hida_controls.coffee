DefaultController = require '../../logic/controller'

module.exports = (module) ->

  module.directive 'dicomHidaControls', ->
    restrict: 'E'
    scope: 
      viewer: '='
      graph: '='
    template: require "./dicom_hida_controls.jade"

    controller: ($scope, $rootScope, $state) ->

      new class extends DefaultController

        ###########################
        # Constructor & init      #
        ###########################

        constructor: ->
          super $scope, $rootScope

          @scope.$watch 'graph', (@graph) =>
            # console.info @graph

          @scope.$watch 'viewer', (viewer) =>
            if viewer?
              if @root.temp.hida_reader?
                @start viewer, @root.temp.hida_reader
                delete @root.temp.hida_reader
              else
                # BEGIN DEBUG
                if @root.nw
                  reader = new DicomFSReader [ "/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/HIDADYNFASE1/1.2.752.37.1.1.3407820023.6.166606920130905" ]
                  reader.run().then =>
                    @start viewer, reader

                    # Merge frames
                    @merge()
                    @viewer.frame = 28
                    @viewer.show()

                    # Add predefined ROI
                    path = ["Path", {"applyMatrix": true, "selected": true, "segments": [[{"x": 274, "y": 186, "selected": true}, {"x": 0, "y": 0, "selected": true}, {"x": -9.29862, "y": -15.49769, "selected": true}], [{"x": 228.48614, "y": 162.6823, "selected": true}, {"x": 15.95051, "y": -6.47989, "selected": true}, {"x": -15.92679, "y": 6.78276, "selected": true}], [{"x": 203, "y": 189, "selected": true}, {"x": 3.50985, "y": -3.71631, "selected": true}, {"x": -12.27312, "y": 25.96534, "selected": true}], [{"x": 210.80384, "y": 283.58849, "selected": true}, {"x": -13.5417, "y": -16.06312, "selected": true}, {"x": 7.35594, "y": 1.5159, "selected": true}], [{"x": 241.91684, "y": 251.53305, "selected": true}, {"x": -15.57058, "y": 10.15473, "selected": true}, {"x": 14.38946, "y": -9.38443, "selected": true}], [{"x": 282.33689, "y": 241.85075, "selected": true}, {"x": -17.46858, "y": 7.24307, "selected": true}, {"x": 19.5579, "y": -10.8519, "selected": true}], [{"x": 313.97228, "y": 217.19616, "selected": true}, {"x": -15.99557, "y": 16.52875, "selected": true}, {"x": 18.23573, "y": -18.84358, "selected": true}], [{"x": 292, "y": 192, "selected": true}, {"x": 23.46698, "y": 6.40009, "selected": true}, {"x": 0, "y": 0, "selected": true}]], "closed": true, "strokeColor": [1, 0, 0, 0.5], "strokeWidth": 4, "selectedColor": [1, 0, 0, 1]}]
                    roi = new @viewer.paper.Path()
                    roi.setScaling @viewer.raster.getScaling()
                    @viewer.rois.push roi
                    @viewer.group.addChild roi
                    roi.importJSON path
                    @viewer.paper.view.draw()

                    # Calculate sum
                    @updateRoi roi
                # END DEBUG
                else $state.go 'main.home'

        start: (@viewer, reader) =>
          @merged = false

          @viewer.read reader
          @hida = new Hida @viewer
          @hida.validate @viewer.reader.frames[0].file

          @viewer.on 'roi_add',      (roi) => @updateRoi roi
          @viewer.on 'roi_sub_edit', (roi) => @updateRoi roi
          @viewer.on 'roi_edit',     (roi) => @updateRoi roi

        ###########################
        # Methods                 #
        ###########################

        updateRoi: (roi) =>
          @hida.updateRoi roi, @viewer.raster, @viewer.reader.frames
          @graph.addRoi roi

        merge: =>
          @merged = true
          @unmerged_reader = @viewer.reader
          @viewer.read @hida.reverseMerge @viewer.reader

        unmerge: =>
          @merged = false
          @viewer.read @unmerged_reader

        window: => @viewer.enableWindow()
        draw:   => @viewer.enableDraw()
        edit:   => @viewer.enableEdit()