DicomTags = require './dicom_tags'
DicomFrame = require './dicom_frame'

moment = require 'moment'

COLOR_TYPES = [
  "RGB"
  "PALETTE COLOR" 
  "YBR_FULL" 
  "YBR_FULL_422"
  "YBR_PARTIAL_422" 
  "YBR_PARTIAL_420" 
  "YBR_RCT"
]

class DicomDate
  constructor: (@dateString) -> @date = moment @dateString, 'YYYYMMDD'
  toString:                  -> @date.format 'LL'

class DicomTime
  constructor: (@timeString) -> @time = moment @timeString, 'HHmmss.SSSS'
  toString:                  -> @time.format 'HH:mm.ss SSSS'

class DicomName
  constructor: (name)  -> @name = dicomParser.parsePN name
  toString:            -> "#{@name.givenName} #{@name.familyName}"

module.exports = class DicomFile

  constructor: (@buffer, @path) ->
    @frames = []
    
    @getData()
    @getInfo()
    @getValues()
    @getCustomValues()

  #######################################
  # Public
  #######################################

  isColor: => COLOR_TYPES.indexOf(@colorInt()) isnt -1

  getElement: (tag) => @data.elements[tag]
  get:        (tag) => @data.elements[tag]?.value

  framecount: => parseInt @get 'x00280008'
  colorInt: => @get 'x00280004'

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
  # Private
  #######################################

  getData: =>
    @data = dicomParser.parseDicom new Uint8Array @buffer

  getInfo: =>
    _.each @data.elements, (element, tag) =>
      # Create display tag
      one = tag.substring 1, 5
      two = tag.substring 5, 9
      element.display = "(#{one},#{two})".toUpperCase()

      # Apply mapping info
      upperTag = tag.toUpperCase().replace 'X', 'x'
      if _.has DicomTags, upperTag
        _.defaults element, DicomTags[upperTag]
      else if not element.vr?
        element.vr = 'unsupported'

  getValues: =>
    values = dicomParser.explicitDataSetToJS @data

    _.each @data.elements, (element, tag) =>
      if _.has values, tag
        element.value = values[tag]

        switch element.vr
          when 'PN' then @_singleOrMultple element, (v) -> new DicomName v
          when 'DA' then @_singleOrMultple element, (v) -> new DicomDate v
          when 'TM' then @_singleOrMultple element, (v) -> new DicomTime v

  getCustomValues: =>
    _.each @data.elements, (element, tag) =>
      # Start of with normal type
      element.type = 'normal'

      # We don't support sequences (yet)
      if element.vr is 'SQ'
        element.type = 'sequence'

      # Do some custom mapping
      if element.vm? and not element.value?
        if element.vm is '1'
          switch element.vr
            when 'IS' then element.value = @data.string element.tag, 0
        else 
          switch element.vr
            when 'US' then element.value = @_readMultipleUShort element

      # If it is still unknown
      if element.value?
        if element.value.dataOffset? and element.value.length?
          element.type = 'unsupported'
      else
        element.type = 'unsupported'

  _readMultipleUShort: (element) =>  [0 ... (element.length / 2)].map (i) => @data.uint16 element.tag, i
  _readMultipleSShort: (element) =>  [0 ... (element.length / 2)].map (i) => @data.int16  element.tag, i
  _readMultipleULong:  (element) =>  [0 ... (element.length / 4)].map (i) => @data.uint32 element.tag, i
  _readMultipleSLong:  (element) =>  [0 ... (element.length / 4)].map (i) => @data.int32  element.tag, i
  _readMultipleFloat:  (element) =>  [0 ... (element.length / 4)].map (i) => @data.float  element.tag, i
  _readMultipleDouble: (element) =>  [0 ... (element.length / 8)].map (i) => @data.double element.tag, i

  _singleOrMultple: (element, method) ->
    element.value = 
      if _.isArray element.value
        _.map element.value, method
      else method element.value