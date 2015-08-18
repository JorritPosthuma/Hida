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
        @hida.validate @viewerDir.viewer.reader.frames[0].file

      updateRoi: (roi) =>
        frames = @viewerDir.viewer.reader.frames
        pixels = frames.map (frame) -> frame.image.getPixelData()

        ROI.curve pixels, roi
        .then (sums) => @graphDir.addRoi roi, sums
        .done()
