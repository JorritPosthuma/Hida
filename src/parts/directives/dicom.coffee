module = angular.module 'hida'

parent = CanvasRenderingContext2D.prototype.putImageData
CanvasRenderingContext2D.prototype.putImageData = (data, dx, dy) ->
  # Draw image
  parent.call this, data, dx, dy

  # Draw rectangle
  @beginPath()
  @lineWidth = "2"
  @strokeStyle = "red"
  @rect 30, 30, 50, 50
  @stroke()

module.directive 'dicom', ->
  restrict: 'E'
  scope: 
    images: '='
  templateUrl: "parts/directives/dicom.html"
  link: (scope, element, attrs, ctrl, b) -> scope.ctrl.link element
  controller: ($scope, $rootScope, $timeout) ->

    new class extends DefaultController

      ###########################
      # Instance variables      #
      ###########################

      ww: 0
      wl: 0
      frames: 1
      color: 'No color'

      frame: 1

      scroll_speed: 100 # Higher is slower
      scroll_cumulative: 0

      ###########################
      # Constructor & init      #
      ###########################

      constructor: ->
        super $scope, $rootScope

      ###########################
      # Methods                 #
      ###########################

      link: (@$element) =>
        @element    = @$element[0]
        @$document  = $(document)

        $(window).resize @resize

        cornerstone.enable @element
        @register()

        $scope.$watch 'images', (images) =>
          if images? and images isnt ''
            @image images

      loaded: => @viewport?

      register: =>
        @$element.bind 'mousewheel', (e) =>
          e.preventDefault()
          return if not @loaded()

          direction = e.originalEvent.wheelDelta

          # Make sure we add up in right scroll direction
          if direction > 0
            if @scroll_cumulative < 0
              @scroll_cumulative = 0
          else 
            if @scroll_cumulative > 0
              @scroll_cumulative = 0

          @scroll_cumulative = @scroll_cumulative + direction

          steps = Math.floor Math.abs(@scroll_cumulative) / @scroll_speed

          if steps isnt 0
            @scroll_cumulative = @scroll_cumulative % @scroll_speed
            if direction < 0
              if @frame > 1
                @frame = @frame - 1
                @show true
            else
              if @frame < @frames
                @frame = @frame + 1
                @show true

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

      image: (files) =>
        @reader = new DicomFileReader files

        @frame = 1
        @frames = @reader.getFrameCount()
        @scroll_cumulative = 0
        @viewport = undefined

        @show()

      show: (digest = false) =>
        frame = @reader.getFrame @frame
        frame.image.then (image) =>
          cornerstone.displayImage @element, image
          if not @viewport?
            @viewport = cornerstone.getViewport @element

            @viewport.voi.windowCenter = image.windowCenter
            @viewport.voi.windowWidth = image.windowWidth
            cornerstone.setViewport @element, @viewport

          @ww = Math.round @viewport.voi.windowWidth
          @wl = Math.round @viewport.voi.windowCenter
          @color = frame.getColorInt()

          @resize()

          @scope.$apply() if digest

      resize: =>
        cornerstone.resize @element, true if @loaded()
        @viewport = cornerstone.getViewport @element