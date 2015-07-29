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
    @viewer.rois.push @roi
    @group.addChild @roi
    @roi.strokeColor = new @paper.Color 1, 0, 0, 0.5 # '#009dec'
    @roi.selectedColor = new @paper.Color 1, 0, 0, 1
    @roi.strokeWidth = 4
    @roi.add e.point
    @viewer.emit 'roi_start', @roi

  drag: (e) =>
    @roi.add e.point
    @viewer.emit 'roi_move', @roi

  up: (e) =>
    @roi.simplify 15
    @roi.closed = true
    @viewer.emit 'roi_add', @roi