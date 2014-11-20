module = angular.module 'hida'

module.directive 'dicomViewer', ->
  restrict: 'E'
  scope: 
    binding: '='
  templateUrl: "parts/directives/dicom_viewer.html"
  link: (scope, element) -> scope.ctrl.link element
  controller: ($scope, $rootScope, $timeout) ->

    new class DicomViewer extends DefaultController

      ###########################
      # Instance variables      #
      ###########################

      STATE_WINDOW: 0
      STATE_DRAW:   1
      STATE_EDIT:   2

      ###########################
      # Constructor & init      #
      ###########################

      constructor: ->
        super $scope, $rootScope

        @scroll_speed   = 100
        @frames         = 1
        @state          = @STATE_WINDOW
        @lut_window     = {}
        @rois           = []

      ###########################
      # Linker                  #
      ###########################

      link: (@$element) =>
        @$canvas = @$element.find 'canvas'

        @element = @$element[0]
        @canvas = @$canvas[0]

        @paper = paper.setup @canvas
        @group = new @paper.Group
        @registerWindowTool()
        @registerDrawTool()
        # @registerEditTool()
        @edit_tool = new DicomViewerEditTool @
        @enableScroll()

        $(window).resize @resize

        # Debug
        @image [ "/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166584420130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166584820130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166584920130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585020130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585120130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585220130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585320130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585420130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585520130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585620130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585720130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585820130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585920130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586020130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586120130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586220130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586320130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586420130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586520130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586620130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586720130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586820130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166586920130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166587020130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166587120130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166587220130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166587320130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166587420130905","/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166587520130905" ]

        $scope.$watch 'binding', (control) => control.register @

      ###########################
      # External methods        #
      ###########################

      enableWindow: =>
        @state = @STATE_WINDOW
        @window_tool.activate()

      enableDraw: =>
        @state = @STATE_DRAW
        @draw_tool.activate()

      enableEdit: =>
        @state = @STATE_EDIT
        @edit_tool.activate()

      ###########################
      # Tools                   #
      ###########################

      registerWindowTool: =>
        @window_tool = new @paper.Tool

        @window_tool.onMouseDrag = @ifLoaded (e) =>
          @lut_window.width = @lut_window.width + e.delta.x
          @lut_window.level = @lut_window.level + e.delta.y

          @scope.$apply()

          @draw()

      registerDrawTool: =>
        @draw_tool = new @paper.Tool

        @draw_tool.onMouseDown = @ifLoaded (e) =>
          @roi?.selected = false
          @roi = new @paper.Path()
          @group.addChild @roi
          @rois.push @roi
          @roi.strokeColor = new @paper.Color 1, 0, 0, 0.5 # '#009dec'
          @roi.selectedColor = new @paper.Color 1, 0, 0, 1
          @roi.strokeWidth = 4
          @roi.add e.point

        @draw_tool.onMouseDrag = @ifLoaded (e) =>
          return if not @loaded()
          @roi.add e.point

        @draw_tool.onMouseUp = @ifLoaded (e) =>
          @roi.simplify 5
          @roi.closed = true

      enableScroll: =>
        @$element.bind 'mousewheel', @ifLoaded (e) =>
          e.preventDefault()

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

      ###########################
      # General Methods         #
      ###########################

      # Proxy method that only continues if a image is loaded
      ifLoaded: (fn) =>
        => if @loaded() then fn.apply @, arguments

      # Is an image loaded
      loaded: => @current?

      image: (files) =>
        if files and files.length isnt 0
          # Clean previous
          @current = undefined
          @file

          @reader = new DicomFileReader files

          @frame = 1
          @frames = @reader.getFrameCount()
          @scroll_cumulative = 0

          @show()

      show: =>
        @file = @reader.getFrame @frame
        loaded = @loaded()
        @file.image.then (@current) =>
          if not loaded
            # Set defaults
            @lut_window.width = @current.windowWidth
            @lut_window.level = @current.windowCenter
            @color            = @file.getColorInt()

            @initDraw()

          # Draw
          @draw()

      initDraw: =>
        @group.removeChildren()
        @rois = []

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
        if @loaded()
          @group.fitBounds @paper.view.bounds
          @scaling.current = @raster.scaling.x