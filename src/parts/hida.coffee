DefaultController = require '../logic/controller'
{ DicomFSReader } = require '../logic/dicom/dicom_readers'
Hida              = require '../logic/dicom/hida'

module.exports = (module) ->
  module.controller 'HidaController', ($scope, $rootScope, $timeout, $state, $q) ->

    new class HidaController extends DefaultController

      ###########################
      # constructor             #
      ###########################

      constructor: ->
        super $scope, $rootScope

        @controlsDefer = $q.defer()
        @graphDefer = $q.defer()
        @viewerDefer = $q.defer()
   
        $q.all [@controlsDefer.promise, @graphDefer.promise, @viewerDefer.promise]
        .then @start
        .catch (e) -> console.error e
      
      ###########################
      # Bridge Methods          #
      ###########################

      setControls: (@controlsDir) => @controlsDefer.resolve @controlsDir
      setGraph:    (@graphDir)    => @graphDefer.resolve @graphDir
      setViewer:   (@viewerDir)   => @viewerDefer.resolve @viewerDir

      ###########################
      # Methods                 #
      ###########################

      start: =>
        if @root.temp.hida_reader?
          reader = @root.temp.hida_reader
          delete @root.temp.hida_reader
          @show reader
        else
          @debug()
          # $state.go 'main.home'

      show: (reader) =>
        @viewerDir.viewer.read reader
        @hida = new Hida @
        @hida.on 'warning', @viewerDir.addWarning
        @hida.validate @viewerDir.viewer.reader.frames[0].file

        @viewerDir.viewer.on 'roi_add',      (roi) => @updateRoi roi
        @viewerDir.viewer.on 'roi_sub_edit', (roi) => @updateRoi roi
        @viewerDir.viewer.on 'roi_edit',     (roi) => @updateRoi roi

      updateRoi: (roi) =>
        # console.info roi.exportJSON()

        @hida.updateRoi roi, @viewerDir.viewer.raster, @viewerDir.viewer.reader.frames
        @graphDir.addRoi roi

      debug: =>
        reader = new DicomFSReader [
          "/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/HIDADYNFASE1/1.2.752.37.1.1.3407820023.6.166606920130905"
          "/Users/Jorrit/Development/Hida Private/Data/testfile1.hroi"
        ]

        reader.run().then =>
          @show reader
          @controlsDir.merge()
          @viewerDir.viewer.frame = 28
          @viewerDir.viewer.show()

          # # Add predefined ROI
          # path = ["Path",{"applyMatrix":true,"selected":false,"data":{"sums":[5,2583,10595,15201,18312,20840,22979,25170,27347,28786,30227,32066,33400,34803,36328,37477,38048,39306,40057,41024,42024,43116,43127,43998,44786,45203,46393,46620,47228,47450,47635,48785,48922,48252,49628,50304,49732]},"segments":[[{"x":272,"y":110,"selected":false},{"x":0,"y":0,"selected":false},{"x":-42.43203,"y":-29.43203,"selected":false}],[{"x":240,"y":174,"selected":false},{"x":-12.19883,"y":-6.09941,"selected":false},{"x":0.66852,"y":0.33426,"selected":false}],[{"x":248,"y":174,"selected":false},{"x":-0.45745,"y":0.45745,"selected":false},{"x":3.28205,"y":-3.28205,"selected":false}],[{"x":257,"y":160,"selected":false},{"x":-3.2037,"y":3.2037,"selected":false},{"x":0.67238,"y":-0.67238,"selected":false}],[{"x":306,"y":138,"selected":false},{"x":-18.36106,"y":18.36106,"selected":false},{"x":1.27395,"y":-1.27395,"selected":false}],[{"x":309,"y":127,"selected":false},{"x":1.72214,"y":1.72214,"selected":false},{"x":-9.22958,"y":-5.22958,"selected":false}],[{"x":279,"y":115,"selected":false},{"x":9.58972,"y":9.58972,"selected":false},{"x":0,"y":0,"selected":false}]],"closed":true,"strokeColor":[1,0,0,0.5],"strokeWidth":4,"selectedColor":[1,0,0,1]}]
          # roi = new @viewerDir.viewer.paper.Path()
          # roi.setScaling @viewerDir.viewer.raster.getScaling()
          # @viewerDir.viewer.rois.push roi
          # @viewerDir.viewer.group.addChild roi
          # roi.importJSON path

          # @updateRoi roi

          # path = ["Path",{"applyMatrix":true,"selected":false,"data":{"sums":[7,1608,6090,8076,9204,10486,11388,12003,13210,13760,14165,15090,15527,16115,16983,17243,17526,17902,18597,18911,19369,20026,19457,20025,20515,20575,21064,21157,21611,21670,21590,22164,22287,22645,22917,23126,22760]},"segments":[[{"x":305,"y":125,"selected":false},{"x":0,"y":0,"selected":false},{"x":-21.42712,"y":0,"selected":false}],[{"x":260,"y":129,"selected":false},{"x":0,"y":-37.37039,"selected":false},{"x":0,"y":8.09634,"selected":false}],[{"x":256,"y":158,"selected":false},{"x":-3.8577,"y":-7.7154,"selected":false},{"x":0.5715,"y":1.14301,"selected":false}],[{"x":266,"y":159,"selected":false},{"x":-0.98284,"y":0.98284,"selected":false},{"x":2.44634,"y":-3.44634,"selected":false}],[{"x":310,"y":129,"selected":false},{"x":0,"y":19.73503,"selected":false},{"x":0,"y":0,"selected":false}]],"closed":true,"strokeColor":[1,0,0,0.5],"strokeWidth":4,"selectedColor":[1,0,0,1]}]
          # roi = new @viewerDir.viewer.paper.Path()
          # roi.setScaling @viewerDir.viewer.raster.getScaling()
          # @viewerDir.viewer.rois.push roi
          # @viewerDir.viewer.group.addChild roi
          # roi.importJSON path

          # @updateRoi roi

          # path = ["Path",{"applyMatrix":true,"selected":false,"data":{"sums":[9,6829,5398,3323,3238,3102,2982,2769,2568,2489,2401,2236,2126,2056,1910,1779,1877,1721,1758,1612,1566,1518,1546,1519,1383,1449,1302,1303,1269,1274,1269,1205,1172,1090,1134,1063,1155]},"segments":[[{"x":321,"y":105,"selected":false},{"x":0,"y":0,"selected":false},{"x":0,"y":-12.98966,"selected":false}],[{"x":290,"y":114,"selected":false},{"x":-10.49978,"y":-20.99955,"selected":false},{"x":6.84133,"y":13.68266,"selected":false}],[{"x":321,"y":107,"selected":false},{"x":0,"y":14.31673,"selected":false},{"x":0,"y":0,"selected":false}]],"closed":true,"strokeColor":[1,0,0,0.5],"strokeWidth":4,"selectedColor":[1,0,0,1]}]
          # roi = new @viewerDir.viewer.paper.Path()
          # roi.setScaling @viewerDir.viewer.raster.getScaling()
          # @viewerDir.viewer.rois.push roi
          # @viewerDir.viewer.group.addChild roi
          # roi.importJSON path

          # # Calculate sum
          # @updateRoi roi

          # @viewerDir.viewer.paper.view.draw()

          @hida.analyse 180, 80