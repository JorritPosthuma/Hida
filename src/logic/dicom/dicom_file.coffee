DicomTags = require './dicom_tags'
DicomFrame = require './dicom_frame'

moment = require 'moment'

# Used for detecting if an image is a color of grayscale version
COLOR_TYPES = [
  "RGB"
  "PALETTE COLOR" 
  "YBR_FULL" 
  "YBR_FULL_422"
  "YBR_PARTIAL_422" 
  "YBR_PARTIAL_420" 
  "YBR_RCT"
]

# Helper class to format date tag
class DicomDate
  constructor: (@dateString) -> @date = moment @dateString, 'YYYYMMDD'
  toString:                  -> @date.format 'LL'

# Helper class to format time tag
class DicomTime
  constructor: (@timeString) -> @time = moment @timeString, 'HHmmss.SSSS'
  toString:                  -> @time.format 'HH:mm.ss SSSS'

# Helper class to format name tag
class DicomName
  constructor: (name)  -> @name = dicomParser.parsePN name
  toString:            -> "#{@name.givenName} #{@name.familyName}"

# Main class
module.exports = class DicomFile

  constructor: (@buffer, @path) ->
    @frames = []
    
    # First get tag data (raw ID + data-offset)
    @getData()
    # Match tags to info (especially for implicit tags)
    @getInfo()
    # Get actual values
    @getValues()
    # Do additional value parsing
    @getCustomValues()
    # Flatten tree for UI
    @flattenInfoTree()

  #######################################
  # Public
  #######################################

  isColor: => COLOR_TYPES.indexOf(@colorInt()) isnt -1
  colorInt:   => @get 'x00280004'

  getElement: (tag) => @data.elements[tag]
  get:        (tag) => @data.elements[tag]?.value

  framecount: => parseInt @get 'x00280008'

  # Start parsing DICOM file
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

  _walkDataset: (fn, dict) =>
    walk = (dataset, _dict, level) => _.each dataset, (element, tag) =>
      __dict = fn element, tag, _dict, level

      if element.items?
        _.each element.items, (item, key) =>
          walk item.dataSet.elements, __dict?[key], level + 1
    walk @data.elements, dict, 0

  getData: =>
    @data = dicomParser.parseDicom new Uint8Array @buffer

  getInfo: =>
    @_walkDataset (element, tag) =>
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
    @_walkDataset (element, tag, values, level) =>
      element.level = level
      if _.has values, tag
        value = values[tag]
        if _.isArray value then return value
        else element.value = value
      return
    , dicomParser.explicitDataSetToJS @data

  getCustomValues: =>
    @_walkDataset (element, tag) =>
      # Start of with normal type
      element.type = 'normal'

      # Transform existing values
      if element.vr?
        switch element.vr
          when 'PN' then @_singleOrMultple element, (v) -> new DicomName v
          when 'DA' then @_singleOrMultple element, (v) -> new DicomDate v
          when 'TM' then @_singleOrMultple element, (v) -> new DicomTime v

      # Do some additional VR mapping
      if element.vm? and element.value?.dataOffset?
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

      # Add sequenct functions
      if element.vr is 'SQ'
        element.type = 'sequence'
        element.find = (tag) ->
          result = undefined
          _.find element.items, (item) ->
            _.find item.dataSet.elements, (element, key) ->
              if tag is key
                result = element
                return true
              return false
          result

  flattenInfoTree: =>
    @elementList = []
    @_walkDataset (element) => @elementList.push element

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