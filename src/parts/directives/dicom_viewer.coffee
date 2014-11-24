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

      ###########################
      # Linker                  #
      ###########################

      link: (@$element) =>
        @$canvas = @$element.find 'canvas'

        @element = @$element[0]
        @canvas = @$canvas[0]

        @paper = paper.setup @canvas
        @group = new @paper.Group

        @window_tool  = new DicomViewerWindowTool @
        @draw_tool    = new DicomViewerDrawTool @
        @edit_tool    = new DicomViewerEditTool @

        @enableScroll()

        $(window).resize @resize

        # Debug
        if window.nw
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

      startHida: =>
        new Hida @

      ###########################
      # Tools                   #
      ###########################

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
      loaded: => @file?

      image: (files) =>
        if files and files.length isnt 0
          # Clean previous
          @file = undefined

          @reader = new DicomFSReader files
          @reader.run().then => 
            @frame = 1
            @frames = @reader.getFrameCount()
            @scroll_cumulative = 0
            @show()

      show: =>
        loaded = @loaded()

        # Get file
        @file = @reader.getFrame @frame

        if not loaded
          # Set defaults
          @lut_window.width = @file.image.windowWidth
          @lut_window.level = @file.image.windowCenter
          @color            = @file.file.colorInt()

          @initDraw()

        # Draw
        @draw()

      initDraw: =>
        @group.removeChildren()

        # Create Raster
        @raster = new @paper.Raster
        @raster.setSize new @paper.Size @file.image.width, @file.image.height

        # Add raster to group
        @group.addChild @raster

      draw: =>
        cornerstone.generateLut @file.image, @lut_window.width, @lut_window.level, false
        
        # Overlay DICOM image
        image_data = @raster.createImageData new @paper.Size @file.image.width, @file.image.height

        i = 0
        for pixel in @file.image.getPixelData()
          pixel = @file.image.lut[pixel]
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