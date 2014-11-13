module = angular.module 'hida'

STATE_EMPTY     = 0
STATE_NEW_FILE  = 1

module.directive 'dicomViewer', ->
  restrict: 'E'
  scope: 
    binding: '='
  templateUrl: "parts/directives/dicom_viewer.html"
  link: (scope, element) -> scope.ctrl.link element
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
        @registerWindowTool()
        @registerPathTool()
        @enableScroll()

        $(window).resize @resize

        # Debug
        # @image [ "/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166584420130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166584820130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166584920130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585020130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585120130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585220130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585320130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585420130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585520130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585620130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585720130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585820130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585920130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586020130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586120130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586220130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586320130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586420130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586520130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586620130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586720130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586820130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586920130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166587020130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166587120130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166587220130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166587320130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166587420130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166587520130905" ]

        $scope.$watch 'binding', (control) => control.register @

      enableWindow: =>
        @window_tool.activate()

      enableDraw: =>
        @path_tool.activate()

      enableEdit: =>


      loaded: => @state > STATE_EMPTY

      registerWindowTool: =>
        @window_tool = new @paper.Tool

        @window_tool.onMouseDrag = (e) =>
          @lut_window.width = @lut_window.width + e.delta.x
          @lut_window.level = @lut_window.level + e.delta.y

          @scope.$apply()

          @draw()

      registerPathTool: =>
        @path_tool = new @paper.Tool

        @path_tool.onMouseDown = (e) =>
          @roi?.selected = false
          @roi = new @paper.Path()
          @group.addChild @roi
          @rois.push @roi
          @roi.strokeColor = new @paper.Color 1, 0, 0, 0.5 # '#009dec'
          @roi.selectedColor = new @paper.Color 1, 0, 0, 1
          @roi.strokeWidth = 4
          @roi.add e.point

        @path_tool.onMouseDrag = (e) =>
          @roi.add e.point

        @path_tool.onMouseUp = (e) =>
          @roi.simplify 5
          @roi.closed = true
          @roi.fullySelected = true

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
          if @state is STATE_EMPTY
            # Set defaults
            @lut_window.width = @current.windowWidth
            @lut_window.level = @current.windowCenter
            @color            = @file.getColorInt()

            @state = STATE_NEW_FILE
            @initDraw()

          # Draw
          @draw()

      initDraw: =>
        # Create group
        @group?.remove()
        @group = new @paper.Group

        # Create Raster
        @raster = new @paper.Raster
        @raster.setSize new @paper.Size @current.width, @current.height

        # Add raster to group
        @group.addChild @raster

      draw: =>
        cornerstone.generateLut @current, @lut_window.width, @lut_window.level, false
        
        # Overlay DICOM image
        image_data = @raster.createImageData new @paper.Size @current.width, @current.height

        i = 0
        for pixel in @current.getPixelData()
          pixel = @current.lut[pixel]
          image_data.data[i]    = pixel
          image_data.data[i+1]  = pixel
          image_data.data[i+2]  = pixel
          image_data.data[i+3]  = 255
          i = i + 4

        @raster.setImageData image_data, new @paper.Point 0, 0

        @scaling =
          initial: @raster.scaling.x

        # Resize
        @resize()

        # Force draw!
        @paper.view.draw()

      resize: =>
        @group.fitBounds @paper.view.bounds
        @scaling.current = @raster.scaling.x