module = angular.module 'hida'

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

      rois: []
      roi: []

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

        @$canvas = @$element.find 'canvas'
        @canvas = @$canvas[0]

        @paper = new paper.PaperScope()
        @paper.setup @canvas

        path = new @paper.Path();
        path.strokeColor = 'yellow';

        start = new @paper.Point 0, 0  
        path.moveTo start
        path.lineTo start.add [ 50, 50 ]

        @paper.view.draw()

        @$element.on 'CornerstoneImageRendered', (event, data) =>
          @postRender data.canvasContext

        @register()

        # DEBUG
        @image [ '/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/HIDADYNFASE1/1.2.752.37.1.1.3407820023.6.166606920130905' ]
        
        $scope.$watch 'images', @image

      loaded: => @viewport?

      postRender: (context) =>
        # path = new @paper.Path();
        # path.strokeColor = 'yellow';

        # start = new @paper.Point 50, 50
        # path.moveTo start
        # path.lineTo start.add [ 100, 100 ]

        @paper.view.draw()
        # for roi in @rois
        #   context.beginPath()
        #   context.lineWidth = "2"
        #   context.strokeStyle = "red"
        #   context.moveTo roi[0].x, roi[0].y

        #   for point in roi
        #     context.lineTo point.x, point.y

        #   context.stroke()
        #   context.closePath()

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

          @roi = []
          @rois.push @roi

          @$document.mousemove (e) =>
            if true
              w = @$canvas.width()
              h = @$canvas.height()
              size = Math.min w, h

              xOffset = 0
              yOffset = 0
              if w > h then xOffset = (w - h) / 2
              else yOffset = (h - w) / 2

              x = e.offsetX - Math.floor xOffset
              x = Math.min x, size
              x = Math.max x, 0
              y = e.offsetY - Math.floor yOffset
              y = Math.min y, size
              y = Math.max y, 0

              x = x * (@current.rows / size)
              y = y * (@current.rows / size)

              @roi.push { x: x, y: y }
              @resize()
            else
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
            @roi.push { x: @roi[0].x, y: @roi[0].y }
            @resize()
            @$document.unbind "mousemove"
            @$document.unbind "mouseup"

      image: (files) =>
        if files and files.length isnt 0
          @reader = new DicomFileReader files

          @frame = 1
          @frames = @reader.getFrameCount()
          @scroll_cumulative = 0
          @viewport = undefined

          @show()

      show: (digest = false) =>
        @file = @reader.getFrame @frame
        @file.image.then (@current) =>
          cornerstone.displayImage @element, @current
          if not @viewport?
            @viewport = cornerstone.getViewport @element

            @viewport.voi.windowCenter = @current.windowCenter
            @viewport.voi.windowWidth = @current.windowWidth
            cornerstone.setViewport @element, @viewport

          @ww = Math.round @viewport.voi.windowWidth
          @wl = Math.round @viewport.voi.windowCenter
          @color = @file.getColorInt()

          @resize()

          @scope.$apply() if digest

      resize: =>
        cornerstone.resize @element, true if @loaded()
        @viewport = cornerstone.getViewport @element