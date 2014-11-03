module = angular.module 'hida'
module.controller 'HomeController', ($scope, $rootScope) ->

  new class extends DefaultController

    ###########################
    # Instance variables      #
    ###########################

    ww: 0
    wl: 0
    frames: 1
    color: 'No color'

    frame: 100

    ###########################
    # constructor             #
    ###########################

    constructor: ->
      super $scope, $rootScope

      # DEBUG
      @image "/Users/Jorrit/Development/Hida Private/Patientdata/ANONHBSAMCHERMES1/HIDASPECTFASE2RECONSCAC/1.2.752.37.1.1.3407820023.6.166606720130905"
      @viewport.voi.windowWidth = 185
      @viewport.voi.windowCenter = 84
      cornerstone.setViewport @element, @viewport

    ###########################
    # Methods                 #
    ###########################

    init: =>
      @$element = $('.dicom')
      @element = @$element[0]
      @$document = $(document)

      cornerstone.enable @element
      @register()

    loaded: => @viewport?

    register: =>
      @$element.bind 'mousewheel', (e) =>
        e.preventDefault()
        return if not @loaded()

        direction = e.originalEvent.wheelDelta

        if direction > 0
          if @frame > 1
            @frame = @frame - 1
            @show()
        else
          if @frame < @frames
            @frame = @frame + 1
            @show()

      @$element.mousedown (e) =>
        return if not @loaded()

        lastX = e.pageX
        lastY = e.pageY

        @$document.mousemove (e) =>
          deltaX = e.pageX - lastX
          deltaY = e.pageY - lastY
          lastX = e.pageX
          lastY = e.pageY
          @viewport.voi.windowWidth += deltaX / @viewport.scale
          @viewport.voi.windowCenter += deltaY / @viewport.scale
          cornerstone.setViewport @element, @viewport

          @ww = Math.round @viewport.voi.windowWidth
          @wl = Math.round @viewport.voi.windowCenter
          @scope.$apply()

        @$document.mouseup (e) =>
          @$document.unbind "mousemove"
          @$document.unbind "mouseup"

    image: (file) =>
      @reader = new DicomFileReader file
      @show()

    show: =>
      @reader.get @frame
      .then (image) =>
        cornerstone.displayImage @element, image
        @viewport = cornerstone.getViewport @element

        @ww = @viewport.voi.windowWidth
        @wl = @viewport.voi.windowCenter
        @color = @reader.color_int
        @frames = @reader.framecount
        @scope.$apply()

    open: =>
      file = $('#file')
      self = @
      file.change -> self.image $(@).val()
      file.click()
      return false