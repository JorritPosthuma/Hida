EventBus        = require '../events'
DicomTags       = require './dicom_tags'
{ DicomReader } = require './dicom_readers'

module.exports = class Hida extends EventBus

  constructor: (@bridge) ->
    super()

  ########################################
  # Public methods
  ########################################

  analyse: (length, weigth) =>
    # Basic access variables
    viewer = @bridge.viewerDir.viewer

    length = 183
    weigth = 71

    console.info 'Patient length', length
    console.info 'Patient weigth', weigth

    # Constants
    averageFrameDuration = 10002 / 1000 # In seconds!

    console.info 'Frame duration (seconds)', averageFrameDuration

    # Curves
    order = _.map viewer.rois, (roi, index) =>
      curve = @curve roi

      curve: curve
      last: _.last curve
      index: index

    order = _.sortBy order, 'last'

    liverCurve = order[2].curve        # Get highest
    bloodCurve = order[0].curve        # Get lowest
    remnantLiverCurve = order[1].curve # Get middle
    totalCurve = @totalCurve()

    # liverCurve = [1984, 2854, 4238, 5417, 6151, 6836, 7455, 8126, 8713, 9066, 9803, 10199, 10627, 11089, 11410, 11985, 12368, 12912, 13259, 13547, 13812, 14243, 14497, 15073, 15146, 15633, 15737, 16206, 16345, 16676, 16758, 16983, 17415, 17501, 17655, 17907]
    # bloodCurve = [3133, 1970, 1134, 968.4, 959.2, 959.1, 902.6, 907.2, 797.4, 764.2, 743.7, 741.5, 716.2, 689.5, 652.6, 625.3, 582.9, 620, 583, 578.9, 566.6, 513.5, 531.2, 518.2, 495.8, 471.7, 441.2, 449.8, 434.8, 414.9, 394.1, 430.9, 377.2, 367.2, 388.2, 360.5]
    # remnantLiverCurve = order[1].curve # Get middle
    # totalCurve = [22952, 24264, 23409, 22914, 22814, 22629, 22926, 23316, 23432, 23557, 23919, 24203, 24279, 24793, 24934, 25374, 25739, 26258, 26228, 26601, 26605, 26920, 27113, 27590, 27536, 28094, 28198, 28573, 28464, 28754, 28829, 29127, 29314, 29383, 29529, 29692]

    console.info 'Total curve | F', totalCurve
    console.info 'Blood curve | C', bloodCurve
    console.info 'Liver curve | L', liverCurve
    console.info 'Future remnant liver curve', remnantLiverCurve

    # Start
    BSA = Math.sqrt(length * weigth / 3600)

    console.info 'BSA', BSA

    frameStart = Math.round(150 / averageFrameDuration)
    frameEnd   = Math.round(350 / averageFrameDuration)

    # frameStart = 16
    # frameEnd = 36

    console.info 'Frame start', frameStart
    console.info 'Frame end', frameEnd

    bloodSumStart = @csum(bloodCurve, frameStart - 1, frameStart + 1) / 2
    liverSumStart = @csum(liverCurve, frameStart - 1, frameStart + 1) / 2
    liverSumEnd   = @csum(liverCurve, frameEnd   - 1, frameEnd   + 1) / 2
    totalSumStart = @csum(totalCurve, frameStart - 1, frameStart + 1) / 2
    totalSumEnd   = @csum(totalCurve, frameEnd   - 1, frameEnd   + 1) / 2

    console.info 'Blood Sum (150 sec) | C(t1)', bloodSumStart
    console.info 'Liver Sum (150 sec) | L(t1)', liverSumStart
    console.info 'Liver Sum (350 sec) | L(t2)', liverSumEnd
    console.info 'Total Sum (150 sec) | F(t1)', totalSumStart
    console.info 'Total Sum (350 sec) | F(t2)', totalSumEnd
    
    bloodSumEndNorm = @csum(bloodCurve, frameEnd - 1, frameEnd + 1) / (2 * bloodSumStart)

    console.info 'Blood Sum (350 sec) normalized | Cnorm(t2)', bloodSumEndNorm

    At1  = (totalSumEnd - liverSumStart - (totalSumStart - liverSumStart) * bloodSumEndNorm) / (1 - bloodSumEndNorm) 
    LClr = (liverSumEnd - liverSumStart) / (At1 * @csum(bloodCurve, frameStart, frameEnd) / bloodSumStart) 
    LClr_min = 100 * LClr * 60 / averageFrameDuration

    console.info 'A(t1)', At1
    console.info 'LClr [/frame]', LClr
    console.info 'LClr [%/min]', LClr_min

    totalLiverCounts   = @csum(liverCurve, frameStart, frameEnd)
    remnantLiverCounts = @csum(remnantLiverCurve, frameStart, frameEnd)

    console.info 'Total liver counts', totalLiverCounts
    console.info 'Remnant liver counts', remnantLiverCounts
    
    FRLF = 100 * remnantLiverCounts / totalLiverCounts
    FRLF_BSA_Corrected = (FRLF / 100) * LClr_min / BSA

    console.info 'FRLF', FRLF
    console.info 'FRLF BSA Corrected', FRLF_BSA_Corrected

    [bloodIntercept, bloodSlope] = @fitExponential bloodCurve, frameStart, frameEnd
    [liverIntercept, liverSlope] = @fitExponential liverCurve, frameStart, frameEnd

    console.info 'Exponential fitting of blood curve', bloodIntercept, bloodSlope
    console.info 'Exponential fitting of liver curve', liverIntercept, liverSlope

    BClr = - bloodSlope * 60 * 100
    LClr = liverSlope * 60 * 100

    console.info '-BClr', BClr
    console.info 'LClr', LClr

  fitExponential: (curve, start, end) ->
    # Only get part between begin and end
    slice = _.slice curve, (start - 1), (end - 1)
    # Create index array
    index = _.range slice.length
    # Convert to regression API format
    data = _.zip index, slice
    # Perform fit
    fit = regression 'exponential', data
    console.info fit
    # Only return [intercept, slope]
    fit.equation

  csum: (curve, start, end) ->
    # Only get part between begin and end
    slice = _.slice curve, (start - 1), (end - 1)
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
      if not compare element.value
        @emit 'warning', "The value of DICOM tag '#{element.name}' #{element.display} is incorrect"

    test file, 'x00080008', (value) -> _.contains value, 'DYNAMIC'
    test file, 'x00080060', (value) -> value is 'NM'
    test file, 'x00540020', (value) -> _.isEqual value, [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                                                         2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
    test file, 'x00185100', (value) -> value is 'FFS'
    test file, 'x00280008', (value) -> value is '72'
    test file, 'x00200037', (value) -> false # TODO
    test file, 'x00181242', (value) -> false # TODO
    test file, 'x00540100', (value) -> _.isEqual value, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,
                                                         1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]

  curve: (roi) =>
    viewer = @bridge.viewerDir.viewer
    raster = viewer.raster
    frames = viewer.reader.frames

    frame_pixels  = frames.map (frame) -> frame.image.getPixelData()
    frame_sums    = frame_pixels.map -> 0

    # Determine scaling
    offset = raster.getBounds()
    scaling = raster.getScaling().x

    for x in [0 ... raster.width] by 1
      x_scale = x * scaling + offset.x
      for y in [0 ... raster.height] by 1
        # Calculate relative point
        point = new paper.Point x_scale, y * scaling + offset.y
        if roi.contains point
          i = y * raster.width + x
          for pixels, frame in frame_pixels
            frame_sums[frame] += pixels[i]

    frame_sums

  totalCurve: =>
    _.map @bridge.viewerDir.viewer.reader.frames, (frame) =>
      _.sum frame.image.getPixelData()

  updateRoi: (roi, raster, frames) =>
    frame_pixels  = frames.map (frame) -> frame.image.getPixelData()
    frame_sums    = frame_pixels.map -> 0

    # Determine scaling
    offset = raster.getBounds()
    scaling = raster.getScaling().x

    for x in [0 ... raster.width] by 1
      x_scale = x * scaling + offset.x
      for y in [0 ... raster.height] by 1
        # Calculate relative point
        point = new paper.Point x_scale, y * scaling + offset.y
        if roi.contains point
          i = y * raster.width + x
          for pixels, frame in frame_pixels
            frame_sums[frame] += pixels[i]

    roi.data.sums = frame_sums

  reverseMerge: (reader) =>
    frame_count = reader.getFrameCount()
    frame_count_result = Math.floor frame_count / 2

    console.assert frame_count % 2 is 0, 'Even frame count'

    frames = for left in [1 .. frame_count_result] by 1
      right = (left + frame_count_result)

      left_frame  = reader.getFrame left
      right_frame = reader.getFrame right

      @_reverseMergeFrames left_frame, right_frame

    new DicomReader frames, reader.rois

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