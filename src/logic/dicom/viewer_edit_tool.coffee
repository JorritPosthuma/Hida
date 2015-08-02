DicomViewerTool = require './viewer_base_tool'

module.exports = class DicomViewerEditTool extends DicomViewerTool

  constructor: (viewer) ->
    super viewer

    # Enable elements
    @enableDown()
    @enableUp()
    @enableDrag()

    # Config
    @select_options = 
      class: paper.Path
      segments: true
      stroke: true
      tolerance: 5

    @handle_options = 
      class: paper.Path
      segments: true
      handles: true
      tolerance: 5

  ###########################
  # Event maps              #
  ###########################

  down: (e) =>
    if @selected? then @selectHandle e
    else @select e

  drag: (e) => @dragHandle e

  up: (e) => @stopHandle e

  ###########################
  # Actions                 #
  ###########################

  select: (e) =>
    hit = @group.hitTest e.point, @select_options

    @paper.project.deselectAll()
    if hit?
      @selected = hit.item
      @selected.fullySelected = true
    else
      @selected = undefined

  selectHandle: (e) =>
    hit = @group.hitTest e.point, @handle_options

    if hit?
      @roi = hit.item
      @selected_handle =
        switch hit.type
          when 'segment'    then  hit.segment.point
          when 'handle-in'  then  hit.segment.handleIn
          else                    hit.segment.handleOut
    else @select e

  dragHandle: (e) =>
    if @selected_handle?
      @selected_handle.x = @selected_handle.x + e.delta.x;
      @selected_handle.y = @selected_handle.y + e.delta.y;
      @viewer.emit 'roi_sub_edit', @roi

  stopHandle: (e) =>
    if @selected_handle?
      @selected_handle = undefined
      @viewer.emit 'roi_edit', @roi
      @roi = undefined