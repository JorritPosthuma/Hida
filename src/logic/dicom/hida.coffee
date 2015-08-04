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

    console.info 'Patient length', length
    console.info 'Patient weigth', weigth

    # Constants
    # Phase Information Sequence
    phaseInformation = viewer.reader.frames[0].file.getElement 'x00540032'
    # Actual frame duration
    averageFrameDuration = parseInt phaseInformation.find('x00181242')?.value
    averageFrameDuration = 10000 unless _.isFinite averageFrameDuration
    averageFrameDuration = averageFrameDuration / 1000

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

    # liverCurve = [3561, 9777, 13578, 15991, 17960, 20063, 22054, 23855, 25117, 26343, 27753, 28881, 29998, 30717, 31885, 32732, 33691, 34454, 34778, 35826, 36778, 37238, 37816, 38298, 38876, 39394, 39845, 40399, 40458, 40974, 41699, 41545, 40975, 42019, 42780, 42650]
    # bloodCurve = [4045, 3435, 1935, 1945, 1819, 1716, 1628, 1428, 1416, 1349, 1286, 1192, 1050, 1054, 942.8, 988.4, 938.0, 942.9, 849.3, 847.9, 764.1, 799.3, 759.7, 709.4, 722.8, 648.6, 623.3, 633.1, 598.3, 605.7, 568.1, 591.0, 500.9, 544.8, 489.6, 526.4]
    # totalCurve = [45182, 46890, 42684, 42989, 43381, 44385, 44790, 45214, 45591, 45997, 46697, 47057, 47362, 47546, 47712, 48542, 48990, 49409, 49220, 49657, 50453, 50640, 50798, 51098, 51440, 51460, 51685, 52101, 51836, 52058, 52798, 52582, 53296, 52964, 53261, 52899]
    # remnantLiverCurve = [2237, 5081, 6557, 7278, 8170, 9051, 9641, 10412, 10838, 11395, 11856, 12137, 12516, 12638, 12978, 13607, 13695, 14223, 14094, 14297, 15051, 15277, 15394, 15654, 15725, 16012, 16067, 16291, 16350, 16422, 16917, 16694, 16296, 16813, 17285, 17521]

    console.info 'Total curve | F', totalCurve
    console.info 'Blood curve | C', bloodCurve
    console.info 'Liver curve | L', liverCurve
    console.info 'Future remnant liver curve', remnantLiverCurve

    # Start
    BSA = Math.sqrt(length * weigth / 3600)

    console.info 'BSA', BSA

    frameStart = Math.round(150 / averageFrameDuration)
    frameEnd   = Math.round(350 / averageFrameDuration)

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
    LClr_BSA = LClr_min / BSA

    console.info 'A(t1)', At1
    console.info 'LClr [/frame]', LClr
    console.info 'LClr [%/min]', LClr_min
    console.info 'LClr [BSA Corrected]', LClr_BSA

    totalLiverCounts   = @csum(liverCurve, frameStart, frameEnd)
    remnantLiverCounts = @csum(remnantLiverCurve, frameStart, frameEnd)

    console.info 'Total liver counts', totalLiverCounts
    console.info 'Remnant liver counts', remnantLiverCounts
    
    FRLF = 100 * remnantLiverCounts / totalLiverCounts
    FRLF_BSA_Corrected = (FRLF / 100) * LClr_min / BSA

    console.info 'FRLF', FRLF
    console.info 'FRLF BSA Corrected', FRLF_BSA_Corrected

    [bloodIntercept, bloodSlope] = @fitExponential bloodCurve, frameStart, frameEnd, averageFrameDuration
    [liverIntercept, liverSlope] = @fitExponential liverCurve, frameStart, frameEnd, averageFrameDuration

    console.info 'Exponential fitting of blood curve', bloodIntercept, bloodSlope
    console.info 'Exponential fitting of liver curve', liverIntercept, liverSlope

    BClr = - bloodSlope * 60 * 100
    LClr = liverSlope * 60 * 100

    console.info '-BClr', BClr
    console.info 'LClr', LClr

    Cfit_0  = averageFrameDuration * bloodIntercept
    Cfit_15 = averageFrameDuration * bloodIntercept * Math.exp(bloodSlope * 15 * 60)

    console.info 'Cfit(t=0min)', Cfit_0
    console.info 'Cfit(t=15min)', Cfit_15

    HIDAc15 = 100 - (100 * Cfit_15 / Cfit_0)

    console.info 'HIDA c15', HIDAc15

  fitExponential: (curve, start, end, averageFrameDuration) ->
    # Set time steps
    index  = _.map curve, (value, index) -> index * averageFrameDuration
    # Convert to /sec
    values = _.map curve, (value, index) -> value / averageFrameDuration
    # Create API format
    total = _.zip index, values
    # Perform fit (with slice of total)
    fit = regression 'exponential', _.slice total, start, end
    # Only return [intercept, slope]
    fit.equation

  csum: (curve, start, end) ->
    # Sum all values between begin and end
    _.sum _.slice curve, start, end

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
      afd = parseInt element.find('x00181242')?.value
      return _.isFinite afd
    test file, 'x00540100', (element) -> _.isEqual element.value, [
      1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,
      1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36
    ]

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