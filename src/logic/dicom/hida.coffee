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

    liverCurve = [2525, 7948, 11164, 13286, 15029, 16757, 18234, 19629, 20845, 21884, 23170, 24149, 25065, 25695, 26586, 27177, 28054, 28383, 29057, 29504, 30432, 30872, 31573, 31779, 32180, 32909, 32918, 33443, 33747, 33879, 34614, 34673, 33756, 34687, 35326, 35561]
    bloodCurve = [3176, 2928, 1588, 1574, 1497, 1411, 1274, 1178, 1115, 1079, 1029, 946.7, 875.7, 837.2, 750.6, 777.4, 720.4, 733.3, 652.9, 633.6, 601.9, 620.4, 610.4, 532.2, 544.7, 491.8, 487.1, 481.2, 467.5, 452.6, 432.9, 415.4, 378.9, 402.0, 362.1, 394.5]
    totalCurve = [32707, 37368, 33645, 33918, 34388, 34914, 35212, 35379, 35938, 36151, 36882, 37242, 37534, 37568, 37727, 38280, 38801, 38766, 39022, 38872, 39712, 40017, 40412, 40403, 40551, 40895, 40829, 41085, 41212, 41148, 41822, 41648, 41469, 41638, 42040, 42142]
    remnantLiverCurve = [1551, 4026, 5007, 5574, 6187, 6835, 7168, 7687, 8058, 8387, 8710, 8999, 9341, 9307, 9459, 9885, 10020, 10221, 10283, 10318, 10847, 10960, 11128, 11204, 11349, 11535, 11425, 11669, 11773, 11794, 12091, 12026, 11566, 12008, 12311, 12618]

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
    # fit = regression 'exponential', _.slice total, (start + 1), end
    # Only return [intercept, slope]
    fit.equation

  csum: (curve, start, end) ->
    slice = _.slice curve, (start - 1), (end - 1)
    # console.info "CSUM", slice
    # Sum all values between begin and end
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
      afd = parseInt element.find('x00181242')?.value
      return _.isFinite afd
    test file, 'x00540100', (element) -> _.isEqual element.value, [
      1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,
      1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36
    ]

  # curve: (roi) =>
  #   viewer = @bridge.viewerDir.viewer
  #   raster = viewer.raster
  #   frames = viewer.reader.frames

  #   frame_pixels  = frames.map (frame) -> frame.image.getPixelData()
  #   frame_sums    = frame_pixels.map -> 0
  #   frame_raster  = []

  #   # Determine scaling
  #   offset = raster.getBounds()
  #   scaling = raster.getScaling().x

  #   clone = roi.clone true
  #   clone.strokeWidth = 0
  #   clone.fillColor = 'white'
  #   ras = clone.rasterize raster.resolution

  #   # # console.info "RASTER size", raster.size, raster.resolution
  #   # # console.info "RAS size", ras.size, ras.resolution
  #   # raster_bounds = raster.getBounds()
  #   # console.info "Raster Bounds", raster.getBounds().x, raster.getBounds().y
  #   # clone_bounds  = clone.getBounds()
  #   # console.info "Clone Bounds", clone.getBounds().x, clone.getBounds().y

  #   # bounds = 
  #   #   x: clone_bounds.x - raster_bounds.x
  #   #   y: clone_bounds.y - raster_bounds.y

  #   # console.info "Diff Bounds", bounds.x, bounds.y

  #   # # console.info clone.position
  #   # clone.position.x = clone.position.x - bounds.x
  #   # clone.position.y = clone.position.y - bounds.y

  #   # clone_bounds  = clone.getBounds()
  #   # console.info "Clone Bounds", clone.getBounds().x, clone.getBounds().y
  #   # # console.info clone.position

  #   # bounds = 
  #   #   x: clone_bounds.x - raster_bounds.x
  #   #   y: clone_bounds.y - raster_bounds.y

  #   # scale = 
  #   #   x: bounds.x / scaling
  #   #   y: bounds.y / scaling
  #   # ras = clone.rasterize raster.resolution

  #   # console.info bounds, scale

  #   console.info ras

  #   for x in [0 ... ras.width] by 1
  #     row = ''
  #     for y in [0 ... ras.height] by 1
  #       value = ras.getPixel x, y
  #       # console.info value.brightness, value.lightness
  #       if value.lightness >= 0.5
  #         row += 'X'
  #       else 
  #         row += ' '
  #     frame_raster.push row  

  #   # for y in [0 ... raster.height] by 1
  #   #   y_scale = y * scaling + offset.y
  #   #   row = ''
  #   #   for x in [0 ... raster.width] by 1
  #   #     x_scale = x * scaling + offset.x
  #   #     # Calculate relative point
  #   #     value = ras.getPixel x_scale, y_scale
  #   #     # console.info value.brightness, value.lightness
  #   #     # if 
  #   #     #   row += 'X'
  #   #     #   for pixels, frame in frame_pixels
  #   #     #     i = y * raster.width + x
  #   #     #     frame_sums[frame] += pixels[i]
  #   #     # else
  #   #     #   row += ' '
  #   #   frame_raster.push row

  #   @bridge.viewerDir.viewer.paper.view.draw()
  #   console.info frame_raster.join '\n'

  #   frame_sums

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