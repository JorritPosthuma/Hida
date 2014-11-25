class DicomViewerWindowTool extends DicomViewerTool

  constructor: (viewer) ->
    super viewer

    # Enable elements
    @enableDrag()

  ###########################
  # Actions                 #
  ###########################

  drag: (e) =>
    @viewer.lut_window.width = @viewer.lut_window.width + e.delta.x
    @viewer.lut_window.level = @viewer.lut_window.level + e.delta.y

    @viewer.update?()

    @viewer.draw()