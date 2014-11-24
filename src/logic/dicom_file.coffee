COLOR_INT = [
  "RGB"
  "PALETTE COLOR" 
  "YBR_FULL" 
  "YBR_FULL_422"
  "YBR_PARTIAL_422" 
  "YBR_PARTIAL_420" 
  "YBR_RCT"
]

class DicomFile

  constructor: (@buffer, @path) ->
    @frames = []
    @data = dicomParser.parseDicom new Uint8Array @buffer

  #######################################
  # Private
  #######################################

  _string: (property) => @data.string property

  parse: =>
    method = if @isColor()
    then cornerstoneWADOImageLoader.makeColorImage
    else cornerstoneWADOImageLoader.makeGrayscaleImage

    Q.all [0 ... @framecount()].map (frame_id) =>
      # Create ID
      id = "#{@path}\##{frame_id}"

      # Execute
      Q method id, @data, @data.byteArray, @colorInt(), frame_id
      .then (image) =>
        new DicomFrame @, id, frame_id, image

    # Store all frames then done
    .then (@frames) => @

  #######################################
  # Public
  #######################################

  isColor:      => -1 isnt COLOR_INT.indexOf @colorInt()

  framecount:   => @_string("x00280008") || 1
  colorInt:     => @_string "x00280004"