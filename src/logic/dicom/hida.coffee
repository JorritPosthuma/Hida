class Hida extends EventBus

  constructor: (@viewer) ->
    super()

    ########################################
    # Defaults
    ########################################

    # Step 2 - Summarize ROI's


    # @viewer.group.children.map (child) =>
    #   if child.className is 'Path'
    #     mask =
    #     for x in [0...@width]
    #       for y in [0...@height]
    #         child.contains x, y

    #     console.info mask

    # if @reader.isMultiFile()
    #   alert "HIDA doesn't support multi-frame analysis"

    # @file = @viewer.file

    # #######################################
    # # Input
    # #######################################

    # # Patient Length
    # @patient =
    #   length: 180   # TODO - CM
    #   weight: 80    # TODO - KG

    # # BSA calculation based on Mosteller formula
    # @bsa = Math.sqrt ((@patient.length * @patient.weight) / 3600)

    # @t1 = time: 150 # Time of evenly distributed tracer 
    # @t2 = time: 350 # ???

    # # @t1.frame = # TODO
    # # @t2.frame = # TODO

  ########################################
  # Public methods
  ########################################

  analyse: (length, weigth) =>
    BSA = Math.sqrt(length * weigth / 3600)

    # frameStart = Math.round 150 / averageFrameDuration
    # frameEnd = Math.round 350 / averageFrameDuration

    # bloodSumStart = csum(bloodCurve, frameStart - 1, frameStart + 1) / 2
    # liverSumStart = csum(liverCurve, frameStart - 1, frameStart + 1) / 2
    # liverSumEnd = csum(liverCurve, frameEnd - 1, frameEnd + 1) / 2
    # totalSumStart = csum(totalCurve, frameStart - 1, frameStart + 1) / 2
    # totalSumEnd = csum(totalCurve, frameEnd - 1, frameEnd + 1) / 2

    # bloodSumEndNorm = csum(bloodCurve, frameEnd - 1, frameEnd + 1) / (2 * bloodSumStart)

    # At1 = (totalSumEnd - liverSumStart - (totalSumStart - liverSumStart) * bloodSumEndNorm) / (1 - bloodSumEndNorm) 
    # LClr = (liverSumEnd - liverSumStart) / (At1 * csum(bloodCurve, frameStart, frameEnd) / bloodSumStart) 
    # LClr_min = 100 * LClr * 60 / averageFrameDuration

    # totalLiverCounts = csum(liverCurve, frameStart, frameEnd)
    # remnantLiverCounts = csum(c4, frameStart, frameEnd)
    # FRLF = 100 * remnantLiverCounts / totalLiverCounts
    # FRLF_BSA_Corrected = (FRLF / 100) * LClr_min / BSA

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
        @emit 'warning', "The value of DICOM tag '#{element.info.name}' #{element.info.tag} is incorrect"

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

    console.assert frame_count % 2 is 0, "Even frame count"

    frames = for left in [1 .. frame_count_result] by 1
      right = (left + frame_count_result)

      left_frame  = reader.getFrame left
      right_frame = reader.getFrame right

      @_reverseMergeFrames left_frame, right_frame

    new DicomReader frames

  ########################################
  # Private methods
  ########################################

  # sqrt ( l^2 + r^2 )
  _reverseMergeFrames: (left, right) =>
    width = left.image.height
    height = left.image.width

    # Init
    left_data   = left.image.getPixelData()
    right_data  = right.image.getPixelData()
    target_data = new Array left_data.length

    # Check
    console.assert left_data.length is right_data.length, "Equal size images"
    console.assert not left.file.isColor(), "Left image is grayscale"
    console.assert not right.file.isColor(), "Right image is grayscale"

    # Merge!
    i = 0
    max = 0
    for y in [0 ... height] by 1
      for x in [0 ... width] by 1
        # Calculate reverse horizontal position
        right_i = y * width + (width - (x + 1))

        # Calculate new value
        value = Math.round Math.sqrt( Math.pow(left_data[i], 2) + Math.pow(right_data[right_i], 2) )

        target_data[i] = value
        max = Math.max max, value

        # Increment
        i += 1

    # Create new frame (based on left)
    left.derive target_data, max