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

      ###########################
      # Methods                 #
      ###########################

      link: (@$element) =>
        @$canvas = @$element.find 'canvas'

        @element = @$element[0]
        @canvas = @$canvas[0]

        @paper = paper.setup @canvas
        @tool = new @paper.Tool

        @tool.onMouseDown = (e) =>
          @ww_cache = @ww
          @wc_cache = @wc

        @tool.onMouseDrag = (e) =>
          @ww = @ww_cache + (e.point.x - e.downPoint.x)
          @wc = @wc_cache + (e.point.y - e.downPoint.y)
          @redraw()

        $(window).resize @resize

        # Debug
        @image [ '/Users/Jorrit/Development/Hida Private/Data/ANONHBSAMCHERMES1/ABD70SEC50I30F3/1.2.752.37.1.1.3407820023.6.166585320130905' ]

      image: (files) =>
        @reader = new DicomFileReader files
        @show @reader

      show: =>
        @file = @reader.getFrame 1
        @file.image.then (@current) =>
          # Set defaults
          @ww = @current.windowWidth
          @wc = @current.windowCenter

          # Draw
          @draw()

      redraw: =>
        @raster.remove()
        @draw()

      draw: =>
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

        cornerstone.generateLut @current, @ww, @wc, false
        cornerstone.storedPixelDataToCanvasImageData @current.getPixelData(), @current.lut, image_data.data

        @raster.setImageData image_data, new @paper.Point 0, 0

        # Resize
        @resize()

        # Draw!!
        @paper.view.draw()

      resize: =>
        @raster.fitBounds @paper.view.bounds        