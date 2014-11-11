module = angular.module 'hida'

module.directive 'paperDicom', ->
  restrict: 'E'
  scope: 
    images: '='
  templateUrl: "parts/directives/paper_dicom.html"
  link: (scope, element, attrs, ctrl, b) -> scope.ctrl.link element
  controller: ($scope, $rootScope, $timeout) ->

    new class extends DefaultController

      ###########################
      # Instance variables      #
      ###########################

      ###########################
      # Constructor & init      #
      ###########################

      constructor: ->
        super $scope, $rootScope

        @scroll_speed = 100
        @frames = 1

      ###########################
      # Methods                 #
      ###########################

      link: (@$element) =>
        @$canvas = @$element.find 'canvas'

        @element = @$element[0]
        @canvas = @$canvas[0]

        @paper = paper.setup @canvas
        @enableWindow()
        @enableScroll()

        $(window).resize @resize

        # Debug
        @image [ '/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585320130905' ]

        $scope.$watch 'images', @image

      loaded: => @current?

      enableWindow: =>
        @tool = new @paper.Tool

        @tool.onMouseDown = (e) =>
          @ww_cache = @ww
          @wl_cache = @wl

        @tool.onMouseDrag = (e) =>
          @ww = @ww_cache + (e.point.x - e.downPoint.x)
          @wl = @wl_cache + (e.point.y - e.downPoint.y)

          @scope.$apply()

          @draw()

      enableScroll: =>
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
                @show()
            else
              if @frame < @frames
                @frame = @frame + 1
                @show()

            @scope.$apply()

      image: (files) =>
        if files and files.length isnt 0
          @reader = new DicomFileReader files

          @frame = 1
          @frames = @reader.getFrameCount()
          @scroll_cumulative = 0

          @show()

      show: =>
        @file = @reader.getFrame @frame
        @file.image.then (@current) =>
          # Set defaults
          @ww = @current.windowWidth if not @ww
          @wl = @current.windowCenter if not @wl

          # Draw
          @draw()

      draw: =>
        # Clean-up possible left-overs
        @raster?.remove()

        # Create white rectangle
        dim = new @paper.Rectangle 0, 0, @current.width / 2, @current.height / 2
        rect = new @paper.Shape.Rectangle dim
        rect.fillColor = new @paper.Color 1, 1, 1

        # Turn into white canvas
        @raster = rect.rasterize()

        # Remove original white rectangle
        rect.remove()
        
        # Overlay DICOM image
        image_data = @raster.getImageData new @paper.Rectangle 0, 0, @current.width, @current.height

        cornerstone.generateLut @current, @ww, @wl, false
        cornerstone.storedPixelDataToCanvasImageData @current.getPixelData(), @current.lut, image_data.data

        @raster.setImageData image_data, new @paper.Point 0, 0

        # Resize
        @resize()

        # Force draw!
        @paper.view.draw()

      resize: =>
        @raster.fitBounds @paper.view.bounds        