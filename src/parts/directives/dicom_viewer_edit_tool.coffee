class DicomViewerEditTool extends DicomViewerTool

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
      handles: true
      tolerance: 5

  ###########################
  # Event maps              #
  ###########################

  down: (e) =>
    if @selected? then @selectHandle e
    else @select e

  up: (e) => @stopHandle e

  drag: (e) => @dragHandle e

  ###########################
  # Actions                 #
  ###########################

  select: (e) =>
    hit = @group.hitTest e.point, @select_options
    if hit?
      @selected = hit.item
      @selected.fullySelected = true
    else
      if @selected?
        @paper.project.deselectAll()
        @selected = undefined

  selectHandle: (e) =>
    hit = @group.hitTest e.point, @select_options
    if hit? and hit.type is 'segment'
      @selected_handle = hit.segment.point
    else 
      hit = @group.hitTest e.point, @handle_options
      if hit?
        @selected_handle =
          if hit.type is 'handle-in' then hit.segment.handleIn
          else hit.segment.handleOut

  dragHandle: (e) =>
    if @selected_handle?
      @selected_handle.x = @selected_handle.x + e.delta.x;
      @selected_handle.y = @selected_handle.y + e.delta.y;

  stopHandle: (e) =>
    if @selected_handle?
      @selected_handle = undefined

###

registerEditTool: =>
  @edit_tool = new @paper.Tool

  # @edit_tool.onMouseMove = @ifLoaded (e) =>

  # @edit_tool.onMouseDown = @ifLoaded (e) =>
  #   if @selected?
  #     hit = @group.hitTest e.point, edit_options
      
  #     if hit?
  #       @selected_handle =
  #         if hit.type is 'handle-in' then hit.segment.handleIn
  #         else hit.segment.handleOut
  #   else
  #     hit = @group.hitTest e.point, select_options
    
  #     if hit? and not hit.selected
  #       @paper.project.deselectAll()
  #       @selected = hit.item
  #       hit.item.fullySelected = true

  # @draw_tool.onMouseDrag = @ifLoaded (e) =>
  #   if @selected_handle?

  @edit_tool.onMouseDown  = @ifLoaded @editMouseDown
  @draw_tool.onMouseDrag  = @ifLoaded @editMouseDrag
  @edit_tool.onMouseUp    = @ifLoaded @editMouseUp

editMouseDown: (e) =>
  if @selected_handle?

  else if @selected

  else

editMouseDrag: (e) =>

editMouseUp: (e) => @editDeselect e

editSelect: (e) =>

editSelectHandle: (e) =>

editDeselect: (e) =>
  @paper.project.deselectAll()
  @selected = undefined
  @selected_handle = undefined

###