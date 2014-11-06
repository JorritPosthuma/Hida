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
  # Constructor             #
  ###########################

  constructor: (@paths) ->

    ###########################
    # Instance variables      #
    ###########################

    @frames = []

    ###########################
    # Init                    #
    ###########################

    @fs = require "fs"

    for path in @paths
      @file = 
        path: path

      @_read()
      @_load()

  ###########################
  # Methods                 #
  ###########################

  _read: =>
    buffer  = @fs.readFileSync @file.path

    @file.data = dicomParser.parseDicom new Uint8Array buffer
    @file.framecount = @file.data.string("x00280008") || 1
    @file.color_int  = @file.data.string("x00280004")
    @file.is_color   = -1 isnt color_interpretations.indexOf @color_int

  _load: =>
    method = if @file.is_color
    then cornerstoneWADOImageLoader.makeColorImage
    else cornerstoneWADOImageLoader.makeGrayscaleImage

    for frame_id in [0..@file.framecount - 1]
      id = "#{@file.path}\##{frame_id}"
      image = method id, @file.data, @file.data.byteArray, @file.color_int, frame_id

      @frames.push new DicomFrame file, id, frame_id, image


  getFrame: (frame) => @frames[frame - 1]

  getFrameCount: => @frames.length

class DicomFrame

  constructor: (@file, @id, @frame_nr, @image) ->

  getColorInt: => file.color_int