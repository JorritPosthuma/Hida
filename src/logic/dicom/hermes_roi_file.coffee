info_match  = /^([\w\s]*)\s*:=\s*([\d]*)$/
type_point  = /^(\d+)\s+((?:\d|[e\-\.])+)\s+((?:\d|[e\-\.])+)$/
type_rect   = /^((?:\d|[e\-\.])+)\s+((?:\d|[e\-\.])+)\s+((?:\d|[e\-\.])+)\s+((?:\d|[e\-\.])+)$/

TOKEN = {}
TOKEN.INFO = 0
TOKEN.DATA_POINT = 1
TOKEN.DATA_RECT = 2

module.exports = class HermesRoiFile

  constructor: (buffer, @name) ->
    @data = buffer.toString('utf-8').split '\n'
    @rois = []

  parse: =>
    throw 'No valid HERMES roi file' unless _.startsWith @data[0], 'HERMES ROI'

    roi = new HermesRoi

    # Tokenize
    _.forEach @data, (line) =>
      # Info
      match = line.match info_match
      if match?
        # Check for existing roi
        if roi.data.length > 0
          @rois.push roi
          roi = new HermesRoi
        # Add info
        return roi.addInfo match...

      # Point
      match = line.match type_point
      if match?
        return roi.addPoint match...

      # Rect
      match = line.match type_rect
      if match?
        return roi.addRect match...
      
      # Else, clean roi
      roi = new HermesRoi

    # Add last roi
    if roi.data.length > 0
      @rois.push roi

class HermesRoi

  constructor: ->
    @info = {}
    @data = []

  addInfo: (original, key, value) =>
    key = key.trim()
    value = parseInt value
    @info[key] = value

  addPoint: (original, index, x, y) =>
    @data.push
      x: parseFloat x
      y: 1 - parseFloat y

  addRect: (original, x, y, width, height) =>
    @data.push
      x: parseFloat x
      y: parseFloat y
      width: parseFloat width
      height: parseFloat height

  toPath: (paper, bounds) =>
    switch @info['roi type']
      when 1, 2 then @toPointPath paper, bounds
      # when 3    then @toRectPath paper, bounds
      
  toPointPath: (paper, bounds) =>
    roi = new paper.Path()
    roi.strokeColor = new paper.Color 1, 0, 0, 0.5 # '#009dec'
    roi.selectedColor = new paper.Color 1, 0, 0, 1
    roi.strokeWidth = 4
    _.forEach @data, (point) ->
      roi.add 
        x: bounds.x + bounds.width * point.x
        y: bounds.y + bounds.height * point.y
    roi.closed = true    
    roi.simplify 10
    roi

  toRectPath: (paper, bounds) =>
    point = @data[0]
    console.info point, bounds
    rect = new paper.Rectangle
      x: bounds.x + bounds.width * point.x
      y: bounds.y + bounds.height * point.y
      width: point.width * bounds.width
      height: point.height * bounds.height
    console.info rect
    roi = new paper.Shape.Rectangle rect
    roi.strokeColor = new paper.Color 1, 0, 0, 0.5 # '#009dec'
    roi.selectedColor = new paper.Color 1, 0, 0, 1
    roi.strokeWidth = 4
    roi