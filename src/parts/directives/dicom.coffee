module = angular.module 'hida'

module.directive 'dicom', ->
  restrict: 'E'
  scope: 
    path: '='
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
      scroll: 0

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

        $scope.$watch 'path', (path) =>
          console.info path
          if path? and path isnt ''
            @image path

        # @image "/Users/Jorrit/Development/Hida Private/Patientdata/ANONHBSAMCHERMES1/HIDASPECTFASE2RECONSCAC/1.2.752.37.1.1.3407820023.6.166606720130905"
        # @viewport.voi.windowWidth = 185
        # @viewport.voi.windowCenter = 84
        # cornerstone.setViewport @element, @viewport        

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

          # console.info cornerstone

          @ww = @viewport.voi.windowWidth
          @wl = @viewport.voi.windowCenter
          @color = @reader.color_int
          @frames = @reader.framecount
          @scope.$apply()

      resize: =>
        cornerstone.resize @element, true if @loaded()