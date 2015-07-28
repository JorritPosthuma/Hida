module = angular.module 'hida'
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
        $state.go 'main.home'

    show: (reader) =>
      @viewerDir.viewer.read reader
      @hida = new Hida @viewerDir.viewer
      @hida.on 'warning', @viewerDir.addWarning
      @hida.validate @viewerDir.viewer.reader.frames[0].file

      @viewerDir.viewer.on 'roi_add',      (roi) => @updateRoi roi
      @viewerDir.viewer.on 'roi_sub_edit', (roi) => @updateRoi roi
      @viewerDir.viewer.on 'roi_edit',     (roi) => @updateRoi roi

    updateRoi: (roi) =>
      @hida.updateRoi roi, @viewerDir.viewer.raster, @viewerDir.viewer.reader.frames
      @graphDir.addRoi roi