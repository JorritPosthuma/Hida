COLOR_INT = [
  "RGB"
  "PALETTE COLOR" 
  "YBR_FULL" 
  "YBR_FULL_422"
  "YBR_PARTIAL_422" 
  "YBR_PARTIAL_420" 
  "YBR_RCT"
]

print = (args...) -> 
  args.map (arg) ->
    process.stdout.write JSON.stringify(arg) + ' '
  process.stdout.write '\n'

# process.on "uncaughtException", (e) -> console.log e

class DicomDate

  constructor: (@value) -> @parse()

  parse: ->
    if value and value.length is 8
      @years  = parseInt value.substring(0, 4), 10
      @months = parseInt value.substring(4, 6), 10
      @days   = parseInt value.substring(6, 8), 10

  toDate: => new Date @years, @months - 1, @days

class DicomTime

  constructor: (@value) -> @parse()

  parse: ->
    if @value and @value.length >= 2 # must at least have HH
      @hours   = parseInt(@value.substring(0, 2), 10)
      @minutes = if @value.length >= 4 then parseInt(@value.substring(2, 4), 10)  else 0
      @seconds = if @value.length >= 6 then parseInt(@value.substring(4, 6), 10)  else 0
      @fs      = if @value.length >= 8 then parseInt(@value.substring(7, 13), 10) else 0

class DicomFile

  constructor: (@buffer, @path) ->
    @frames = []
    @data = dicomParser.parseDicom new Uint8Array @buffer

    for tag, element of @data.elements
      @info element
      if element.length < 1024
        @read element

  #######################################
  # Private
  #######################################

  _readUShort: (element) =>  [0 ... (element.length / 2)].map (i) => @data.uint16 element.tag, i
  _readSShort: (element) =>  [0 ... (element.length / 2)].map (i) => @data.int16  element.tag, i
  _readULong:  (element) =>  [0 ... (element.length / 4)].map (i) => @data.uint32 element.tag, i
  _readSLong:  (element) =>  [0 ... (element.length / 4)].map (i) => @data.int32  element.tag, i
  _readFloat:  (element) =>  [0 ... (element.length / 4)].map (i) => @data.float  element.tag, i
  _readDouble: (element) =>  [0 ... (element.length / 8)].map (i) => @data.double element.tag, i

  _readMultiString: (element) => @data.string(element.tag).split '\\'

  _readName: (element) => @__readName @data.string element.tag

  _readMultiName: (element) => @_readMultiString(element).map @__readName

  __readName: (input) =>
    split = input.split '^'
    familyName: split[0]
    givenName:  split[1]
    middleName: split[2]
    prefix:     split[3]
    suffix:     split[4]

  _readTime: (value) ->
    if value and value.length >= 2 # must at least have HH
      hours: parseInt(value.substring(0, 2), 10)
      minutes: (if value.length >= 4 then parseInt(value.substring(2, 4), 10) else 0)
      seconds: (if value.length >= 6 then parseInt(value.substring(4, 6), 10) else 0)
      fs: (if value.length >= 8 then parseInt(value.substring(7, 13), 10) else 0)

  readTag: (tag) => @read @data.elements[tag]

  info: (element) =>
    info_name = 'x' + element.tag.toUpperCase().slice 1
    element.info = DicomTags[info_name]

  read: (element) =>
    return if element.length is 0

    single = element.info?.vm is '1'

    element.value = if not single
      switch element.vr
        when 'CS' then @_readMultiString element
        when 'OW' then @_readULong element # TODO: Check
        when 'LO' then @_readMultiString element
        when 'SS' then @_readSShort element
        when 'FL' then @_readFloat element
        when 'US' then @_readUShort element
        when 'SL' then @_readSLong element
        when 'PN' then @_readMultiName element
        when 'DS' then @_readMultiString(element).map parseFloat
        when 'AT' then undefined # Unsupported
        when 'TM' then @_readMultiString(element).map @_readTime
        when 'DA' then undefined # Unsupported
        else print 'multi', element.vr
    else
      switch element.vr
        when 'UI' then @data.string element.tag # TODO, map to UI: https://github.com/grmble/node-dicom/blob/8a962d18656fd14c8cc20020a1c45113762290c3/extra/uids.xml
        when 'IS' then @data.intString element.tag 
        when 'SH' then @data.string element.tag 
        when 'OB' then @data.uint16 element.tag # TODO: Check
        when 'US' then @data.uint16 element.tag
        when 'SQ' then undefined # TODO, something recursive like element.items.map @read
        when 'TM' then @data.time element.tag
        when 'DA' then @data.date element.tag 
        when 'LO' then @data.string element.tag
        when 'PN' then @_readName element
        when 'CS' then @data.string element.tag
        when 'AS' then @data.string element.tag # TODO Parse year string
        else print 'single', element.vr
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

  isColor:             => -1 isnt COLOR_INT.indexOf @colorInt()

  framecount:          => @readTag 'x00280008'
  colorInt:            => @data.string "x00280004"
  imageType:           => @data.string "x00080008"
  modality:            => @data.string "x00080060"

  detectorVector:      => @readTag 'x00540020'

  patientPosition:     => @data.string "x00185100"
  imageOrientation:    => @data.string "x00200037"
  actualFrameDuration: => @data.string "x00181242"
  timeSliceVector:     => @data.string "x00540100"