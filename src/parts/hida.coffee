DefaultController = require '../logic/controller'
{ DicomFSReader } = require '../logic/dicom/dicom_readers'
Hida              = require '../logic/dicom/hida'
ROI               = require '../logic/dicom/roi'

module.exports = (module) ->
  module.controller 'HidaController', ($scope, $rootScope, $timeout, $state) ->

    new class HidaController extends DefaultController

      ###########################
      # constructor             #
      ###########################

      constructor: ->
        super $scope, $rootScope

        @controlsDefer = Q.defer()
        @graphDefer = Q.defer()
        @viewerDefer = Q.defer()
   
        Q.all [@controlsDefer.promise, @graphDefer.promise, @viewerDefer.promise]
        .then @start
        .done()
      
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
        @hida = new Hida @

        @viewerDir.viewer.on 'roi_add',      (roi)   => @updateRoi roi
        @viewerDir.viewer.on 'roi_sub_edit', (roi)   => @updateRoi roi
        @viewerDir.viewer.on 'roi_edit',     (roi)   => @updateRoi roi
        @viewerDir.viewer.on 'roi_clear',            => @graphDir.create()
        @viewerDir.viewer.on 'resize',       (width) => @graphDir.resize width
        @viewerDir.viewer.on 'file_load',               @validate

        @hida.on 'warning', @viewerDir.addWarning

        if @viewerDir.viewer.loaded()
          @viewerDir.viewer.reread()
          @validate()

      validate: =>
        @hida.validate @viewerDir.viewer.viewer.frames[0].file

      updateRoi: (roi) =>
        frames = @viewerDir.viewer.reader.frames
        pixels = frames.map (frame) -> frame.image.getPixelData()

        ROI.curve pixels, roi
        .then (sums) => @graphDir.addRoi roi, sums
        .done()

      debug: =>
        reader = new DicomFSReader [
          "/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/HIDADYNFASE1/1.2.752.37.1.1.3407820023.6.166606920130905"
          # "/Users/Jorrit/Development/Hida Private/Data/dcm150406921.0000.dcm"
          # "/Users/Jorrit/Development/Hida Private/Data/dcm153821220.0000.dcm"
          "/Users/Jorrit/Development/Hida Private/Data/testfile1.hroi"
        ]

        reader.run().then =>
          @show reader
          $timeout =>
            @controlsDir.merge()
            @viewerDir.viewer.frame = 28
            @viewerDir.viewer.show()

            # @hida.analyse 183, 71
          , 1000
        .done()