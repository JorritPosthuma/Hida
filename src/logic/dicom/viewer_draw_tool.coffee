DicomViewerTool = require './viewer_base_tool'

module.exports = class DicomViewerDrawTool extends DicomViewerTool

  constructor: (viewer) ->
    super viewer

    # Enable elements
    @enableDown()
    @enableUp()
    @enableDrag()

  ###########################
  # Actions                 #
  ###########################

  down: (e) =>
    @roi?.selected = false
    @roi = new @paper.Path()
    @roi.original = []
    @viewer.rois.push @roi
    @group.addChild @roi
    @roi.strokeColor = new @paper.Color 1, 0, 0, 0.5 # '#009dec'
    @roi.selectedColor = new @paper.Color 1, 0, 0, 1
    @roi.strokeWidth = 4
    @addPoint e
    @viewer.emit 'roi_start', @roi

  drag: (e) =>
    @addPoint e
    @viewer.emit 'roi_move', @roi

  up: (e) =>
    @roi.closed = true
    @viewer.emit 'roi_add', @roi

  addPoint: (e) =>
    # # First add point
    # @roi.add e.point
    # Get size of raster
    width = @viewer.raster.size.width
    # And half
    half = width / 2
    # Get point relative to raster
    local = @viewer.raster.globalToLocal e.point
    local = @clampPoint local, (0 - half), half

    # Add clamped
    @roi.add @viewer.raster.localToGlobal local

    # Because point is relative to middle, first add half, then devide by width
    @roi.original.push
      x: (local.x + half) / width
      y: (local.y + half) / width

  # Make sure point is only within bounds
  clamp: (number, min = 0, max = 1) ->
    Math.max min, Math.min number, max

  clampPoint: (point, min = 0, max = 1) =>
    new paper.Point
      y: @clamp point.y, min, max
      x: @clamp point.x, min, max