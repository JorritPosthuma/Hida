class DicomViewerDrawTool extends DicomViewerTool

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

  drag: (e) =>
    @roi.add e.point

  up: (e) =>
    @roi.simplify 5
    @roi.closed = true