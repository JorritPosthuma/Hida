module = angular.module 'hida'

STATE_EMPTY     = 0
STATE_NEW_FILE  = 1
STATE_WINDOW    = 2
STATE_PATH      = 3

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

        @scroll_speed   = 100
        @frames         = 1
        @state          = STATE_EMPTY
        @lut_window     = {}
        @rois           = []

      ###########################
      # Methods                 #
      ###########################

      link: (@$element) =>
        @$canvas = @$element.find 'canvas'

        @element = @$element[0]
        @canvas = @$canvas[0]

        @paper = paper.setup @canvas
        # @enableWindow()
        @enablePath()
        @enableScroll()

        $(window).resize @resize

        # Debug
        @image [ "/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166584420130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166584820130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166584920130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585020130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585120130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585220130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585320130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585420130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585520130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585620130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585720130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585820130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585920130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586020130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586120130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586220130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586320130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586420130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586520130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586620130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586720130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586820130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586920130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166587020130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166587120130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166587220130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166587320130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166587420130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166587520130905" ]

        $scope.$watch 'images', @image

      loaded: => @state > STATE_EMPTY

      enableWindow: =>
        @window_tool = new @paper.Tool

        @window_tool.onMouseDrag = (e) =>
          @lut_window.width = @lut_window.width + e.delta.x
          @lut_window.level = @lut_window.level + e.delta.y

          @scope.$apply()

          @draw()

      enablePath: =>
        @path_tool = new @paper.Tool

        @path_tool.onMouseDown = (e) =>
          @roi?.selected = false
          @roi = new @paper.Path()
          @rois.push @roi
          @roi.strokeColor = 'red'
          @roi.strokeWidth = 4
          @roi.add e.point

        @path_tool.onMouseDrag = (e) =>
          @roi.add e.point

        @path_tool.onMouseUp = (e) =>
          @roi.simplify()
          @roi.closed = true
          # @roi.selected = true

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
        console.info files
        if files and files.length isnt 0
          @reader = new DicomFileReader files

          @frame = 1
          @frames = @reader.getFrameCount()
          @scroll_cumulative = 0

          @show()

      show: =>
        @file = @reader.getFrame @frame
        @file.image.then (@current) =>
          if @state is STATE_EMPTY
            # Set defaults
            @lut_window.width = @current.windowWidth
            @lut_window.level = @current.windowCenter

            @state = STATE_NEW_FILE

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

        cornerstone.generateLut @current, @lut_window.width, @lut_window.level, false
        cornerstone.storedPixelDataToCanvasImageData @current.getPixelData(), @current.lut, image_data.data

        @raster.setImageData image_data, new @paper.Point 0, 0

        # Resize
        @resize()

        # Force draw!
        @paper.view.draw()

      resize: =>
        @raster.fitBounds @paper.view.bounds        