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
    values = dicomParser.explicitDataSetToJS @data

    _.forEach @data.elements, (element, tag) => @read element, tag, values

  #######################################
  # Private
  #######################################

  _readMultipleUShort: (element) =>  [0 ... (element.length / 2)].map (i) => @data.uint16 element.tag, i
  _readMultipleSShort: (element) =>  [0 ... (element.length / 2)].map (i) => @data.int16  element.tag, i
  _readMultipleULong:  (element) =>  [0 ... (element.length / 4)].map (i) => @data.uint32 element.tag, i
  _readMultipleSLong:  (element) =>  [0 ... (element.length / 4)].map (i) => @data.int32  element.tag, i
  _readMultipleFloat:  (element) =>  [0 ... (element.length / 4)].map (i) => @data.float  element.tag, i
  _readMultipleDouble: (element) =>  [0 ... (element.length / 8)].map (i) => @data.double element.tag, i

  read: (element, tag, values) =>
    # Create display tag
    one = tag.substring 1, 5
    two = tag.substring 5, 9
    element.display = "(#{one},#{two})".toUpperCase()

    # Gather data
    if _.has values, tag
      element.value = values[tag]
    if _.has DicomTags, tag
      element.info = DicomTags[tag]

      # Do some custom mapping
      switch element.vr
        when 'US' then element.value = @_readMultipleUShort element

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

  framecount:          => parseInt @data.elements['x00280008']?.value
  colorInt:            => @data.elements['x00280004']?.value
  imageType:           => @data.elements['x00080008']?.value
  modality:            => @data.elements['x00080060']?.value

  detectorVector:      => @data.elements['x00540020']?.value

  patientPosition:     => @data.elements['x00185100']?.value
  imageOrientation:    => @data.elements['x00200037']?.value
  actualFrameDuration: => @data.elements['x00181242']?.value
  timeSliceVector:     => @data.elements['x00540100']?.value