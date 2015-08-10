EventBus = require '../events'
DicomViewerWindowTool = require './viewer_window_tool'
DicomViewerDrawTool = require './viewer_draw_tool'
DicomViewerEditTool = require './viewer_edit_tool'

{ DicomFSReader, DicomHTML5Reader } = require './dicom_readers'

module.exports = class DicomViewer extends EventBus

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
    super()
    # Config
    @scroll_speed       = 100
    @allowScroll        = false

  init: =>
    @state              = @STATE_WINDOW
    @lut_window         = {}
    @file               = undefined
    @rois               = []
    @frame              = 1
    @frames             = 1
    @scroll_cumulative  = 0

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

    @enableDrop()
    @enableScroll()
    @enableWindow()

    # Debounce original resize
    resize = @paper.view._windowEvents.resize
    @paper.view._windowEvents.resize = _.debounce resize, 100

    @paper.view.onResize = @resize

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

  enableDrop: =>
    @element.addEventListener 'dragover', (e) ->
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    , false

    @element.addEventListener 'drop', (e) => 
      e.stopPropagation()
      e.preventDefault()

      @drop e.dataTransfer.files
    , false

  enableScroll: =>
    @$element.on 'mousewheel', @ifLoaded (e) =>
      # Allow temporarily disable scroll
      return if @allowScroll

      # Do not scroll page
      e.preventDefault()

      direction = e.originalEvent.wheelDelta

      # Make sure we add up in right scroll direction
      if direction > 0
        if @scroll_cuative < 0
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

  ###########################
  # General Methods         #
  ###########################

  drop: (files) =>
    reader = new DicomHTML5Reader files
    reader.run().then @read
    .done()

  image: (files) =>
    if files and files.length isnt 0
      reader = new DicomFSReader files
      reader.run().then @read
      .done()

  # Proxy method that only continues if a image is loaded
  ifLoaded: (fn) =>
    => if @loaded() then fn.apply @, arguments

  # Is an image loaded
  loaded: => @file?

  read: (reader) =>
    # Show images
    if reader.frames.length > 0
      @emit 'roi_clear'
      @reader = reader
      # Initialize
      @init()
      @frames = reader.getFrameCount()

      # Show
      @show()

    # ROI's
    if reader.rois.length > 0
      _.forEach reader.rois, (roi) =>
        path = roi.toPath @paper, @raster.bounds
        if path?
          @rois.push path
          @group.addChild path
          @emit 'roi_add', path
      @paper.view.draw()

  show: =>
    loaded = @loaded()

    # Get file
    @file = @reader.getFrame @frame

    if not loaded
      # Set defaults
      @lut_window.width = @file.image.windowWidth
      @lut_window.level = @file.image.windowCenter

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
      pixel = @file.image.lut[Math.round pixel]
      image_data.data[i]    = pixel
      image_data.data[i+1]  = pixel
      image_data.data[i+2]  = pixel
      image_data.data[i+3]  = 255
      i = i + 4

    @raster.setImageData image_data, new @paper.Point 0, 0

    @scaling =
      initial: @raster.scaling.x

    @emit 'update'

    @resize()

  resize: (e) =>
    # First fit canvas element (if not already done)
    @paper.view._windowEvents.resize() unless e?
    # Then fit content
    if @loaded()
      @group.fitBounds @paper.view.bounds
      @scaling.current = @raster.scaling.x
      @paper.view.draw()
      @emit 'resize', @$canvas.width()