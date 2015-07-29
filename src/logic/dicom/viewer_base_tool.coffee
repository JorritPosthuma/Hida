module.exports = class DicomViewerTool

  constructor: (@viewer) ->
    @paper = @viewer.paper
    @group = @viewer.group
    @tool = new @viewer.paper.Tool

  enableDown:  => @tool.onMouseDown  = @ifLoaded @down
  enableUp:    => @tool.onMouseUp    = @ifLoaded @up
  enableDrag:  => @tool.onMouseDrag  = @ifLoaded @drag
  enableMove:  => @tool.onMouseMove  = @ifLoaded @move

  activate: => @tool.activate()

  # Proxy method that only continues if a image is loaded
  ifLoaded: (fn) =>
    => if @viewer.loaded() then fn.apply @, arguments