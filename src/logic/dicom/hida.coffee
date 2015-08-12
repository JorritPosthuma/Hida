pip = require 'robust-point-in-polygon'
Q = require 'q'

EventBus        = require '../events'
DicomTags       = require './dicom_tags'
ROI             = require './roi'
{ DicomReader } = require './dicom_readers'

module.exports = class Hida extends EventBus

  constructor: (@bridge) ->
    super()

  ########################################
  # Public methods
  ########################################

  analyse: (length, weight) =>
    # Basic access variables
    viewer = @bridge.viewerDir.viewer

    # Store all results
    r = 
      length: length
      weight: weight

    # Constants
    # Phase Information Sequence
    phaseInformation = viewer.reader.frames[0].file.getElement 'x00540032'
    # Actual frame duration
    r.averageFrameDuration = parseInt phaseInformation.find('x00181242')?.value
    r.averageFrameDuration = 10000 unless _.isFinite r.averageFrameDuration
    r.averageFrameDuration = r.averageFrameDuration / 1000

    frames = viewer.reader.frames
    pixels = frames.map (frame) -> frame.image.getPixelData()

    start = performance.now()

    curves = _.map viewer.rois, (roi) =>
      ROI.curve pixels, roi, 4

    Q.all curves
    .then (curves) =>
      end = performance.now()

      order = _.map curves, (curve, index) =>
        curve: curve
        last: _.last curve
        index: index

      order = _.sortBy order, 'last'

      r.liverCurve = order[2].curve        # Get highest
      r.bloodCurve = order[0].curve        # Get lowest
      r.remnantLiverCurve = order[1].curve # Get middle
      r.totalCurve = @totalCurve()

      # Start
      r.BSA = Math.sqrt r.length * r.weight / 3600

      r.frameStart = Math.round 150 / r.averageFrameDuration
      r.frameEnd   = Math.round 350 / r.averageFrameDuration

      r.bloodSumStart = @csum(r.bloodCurve, r.frameStart - 1, r.frameStart + 1) / 2
      r.liverSumStart = @csum(r.liverCurve, r.frameStart - 1, r.frameStart + 1) / 2
      r.liverSumEnd   = @csum(r.liverCurve, r.frameEnd   - 1, r.frameEnd   + 1) / 2
      r.totalSumStart = @csum(r.totalCurve, r.frameStart - 1, r.frameStart + 1) / 2
      r.totalSumEnd   = @csum(r.totalCurve, r.frameEnd   - 1, r.frameEnd   + 1) / 2
      
      r.bloodSumEndNorm = @csum(r.bloodCurve, r.frameEnd - 1, r.frameEnd + 1) / (2 * r.bloodSumStart)

      r.At1  = (r.totalSumEnd - r.liverSumStart - (r.totalSumStart - r.liverSumStart) * r.bloodSumEndNorm) / (1 - r.bloodSumEndNorm) 
      r.LClr = (r.liverSumEnd - r.liverSumStart) / (r.At1 * @csum(r.bloodCurve, r.frameStart, r.frameEnd) / r.bloodSumStart) 
      r.LClr_min = 100 * r.LClr * 60 / r.averageFrameDuration
      r.LClr_BSA = r.LClr_min / r.BSA

      r.totalLiverCounts   = @csum(r.liverCurve, r.frameStart, r.frameEnd)
      r.remnantLiverCounts = @csum(r.remnantLiverCurve, r.frameStart, r.frameEnd)
      
      r.FRLF = 100 * r.remnantLiverCounts / r.totalLiverCounts
      r.FRLF_BSA_Corrected = (r.FRLF / 100) * r.LClr_min / r.BSA

      [r.bloodIntercept, r.bloodSlope] = @fitExponential r.bloodCurve, r.frameStart, r.frameEnd, r.averageFrameDuration
      [r.liverIntercept, r.liverSlope] = @fitExponential r.liverCurve, r.frameStart, r.frameEnd, r.averageFrameDuration

      r.BClr_fitted = - r.bloodSlope * 60 * 100
      r.LClr_fitted = r.liverSlope * 60 * 100

      r.Cfit_0  = r.averageFrameDuration * r.bloodIntercept
      r.Cfit_15 = r.averageFrameDuration * r.bloodIntercept * Math.exp(r.bloodSlope * 15 * 60)

      r.HIDAc15 = 100 - (100 * r.Cfit_15 / r.Cfit_0)

      # Also store as internal result
      @result = r

      console.info @result

      return r

  fitExponential: (curve, start, end, averageFrameDuration) ->
    # Set time steps
    index  = _.map curve, (value, index) -> index * averageFrameDuration
    # Convert to /sec
    values = _.map curve, (value, index) -> value / averageFrameDuration
    # Create API format
    total = _.zip index, values
    # Perform fit (with slice of total)
    fit = regression 'exponential', _.slice total, (start + 1), (end + 2)
    # Only return [intercept, slope]
    fit.equation

  csum: (curve, start, end) ->
    # Get subset of curve
    slice = _.slice curve, start, end
    # Sum all values
    _.sum slice

  validate: (file) =>
    test = (file, tag, compare) =>
      # Get element
      element = file.getElement tag

      # Test if has tag
      if not element?
        if _.has DicomTags, tag
          info = DicomTags[tag]
          @emit 'warning', "DICOM tag '#{info.name}' #{info.tag} is missing"
        else
          @emit 'warning', "DICOM tag #{tag} is missing"
        return

      # Test value
      if not compare element
        @emit 'warning', "The value of DICOM tag '#{element.name}' #{element.display} is incorrect"

    test file, 'x00080008', (element) -> _.contains element.value, 'DYNAMIC'
    test file, 'x00080060', (element) -> element.value is 'NM'
    test file, 'x00540020', (element) -> _.isEqual element.value, [
      1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
      2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2
    ]
    test file, 'x00185100', (element) -> element.value is 'FFS'
    test file, 'x00280008', (element) -> element.value is '72'
    # test file, 'x00200037', (element) -> true # TODO
    test file, 'x00540032', (element) -> 
      _.isFinite parseInt element.find('x00181242')?.value
    test file, 'x00540100', (element) -> _.isEqual element.value, [
      1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,
      1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36
    ]
    
  totalCurve: =>
    _.map @bridge.viewerDir.viewer.reader.frames, (frame) =>
      _.sum frame.image.getPixelData()

  reverseMerge: (frames) =>
    frame_count = frames.length
    frame_count_result = Math.floor frame_count / 2

    console.assert frame_count % 2 is 0, 'Even frame count'

    frames = for left in [0 ... frame_count_result] by 1
      right = (left + frame_count_result)

      left_frame  = frames[left]
      right_frame = frames[right]

      @_reverseMergeFrames left_frame, right_frame

    frames

  ########################################
  # Private methods
  ########################################

  # sqrt ( l * r )
  _reverseMergeFrames: (left, right) =>
    width = left.image.height
    height = left.image.width

    # Init
    left_data   = left.image.getPixelData()
    right_data  = right.image.getPixelData()
    target_data = new Array left_data.length

    # Check
    console.assert left_data.length is right_data.length, 'Equal size images'
    console.assert not left.file.isColor(), 'Left image is grayscale'
    console.assert not right.file.isColor(), 'Right image is grayscale'

    # Merge!
    i = 0
    max = 0
    for y in [0 ... height] by 1
      for x in [0 ... width] by 1
        # Calculate reverse horizontal position
        right_i = y * width + (width - (x + 1))

        # Calculate new value
        value = Math.sqrt( left_data[i] * right_data[right_i] )

        target_data[i] = value
        max = Math.max max, value

        # Increment
        i += 1

    # Create new frame (based on left)
    left.derive target_data, max