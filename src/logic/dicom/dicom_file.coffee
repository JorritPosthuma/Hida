COLOR_TYPES = [
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
    @data.values = dicomParser.explicitDataSetToJS @data

    _.forEach @data.elements, @read

  #######################################
  # Private
  #######################################

  read: (element, tag) =>
    # Gather data
    if _.has DicomTags, tag
      element.info = DicomTags[tag]
    if _.has @data.values, tag
      element.value = @data.values[tag]

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

  isColor:             => COLOR_TYPES.indexOf(@colorInt()) isnt -1

  framecount:          => parseInt @data.values['x00280008']
  colorInt:            => @data.values['x00280004']
  imageType:           => @data.values['x00080008']
  modality:            => @data.values['x00080060']

  detectorVector:      => @data.values['x00540020']

  patientPosition:     => @data.values['x00185100']
  imageOrientation:    => @data.values['x00200037']
  actualFrameDuration: => @data.values['x00181242']
  timeSliceVector:     => @data.values['x00540100']