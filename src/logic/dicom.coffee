color_interpretations = [
  "RGB"
  "PALETTE COLOR" 
  "YBR_FULL" 
  "YBR_FULL_422"
  "YBR_PARTIAL_422" 
  "YBR_PARTIAL_420" 
  "YBR_RCT"
]

class DicomFileReader

  ###########################
  # Instance variables      #
  ###########################

  frames = []

  ###########################
  # Constructor             #
  ###########################

  constructor: (@path) ->
    @fs = require "fs"

    @_read()
    @_metadata()
    @_load()

  ###########################
  # Methods                 #
  ###########################

  isColorImage: (color) => 

  _read: =>
    buffer  = @fs.readFileSync @path
    @dataSet = dicomParser.parseDicom new Uint8Array buffer

  _metadata: =>
    @framecount = @dataSet.string("x00280008") || 1
    @color_int  = @dataSet.string("x00280004")
    @is_color   = -1 isnt color_interpretations.indexOf @color_int

  _load: =>
    method = if @is_color
    then cornerstoneWADOImageLoader.makeColorImage
    else cornerstoneWADOImageLoader.makeGrayscaleImage

    @frames = for frame_id in [0..@framecount - 1]
      method "#{@path}_#{frame_id}", @dataSet, @dataSet.byteArray, @color_int, frame_id

  get: (frame) => @frames[frame - 1]