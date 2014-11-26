class Hida

  constructor: ->

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
    console.info roi.data.sums

  reverseMerge: (reader) =>
    frame_count = reader.getFrameCount()
    frame_count_result = frame_count / 2

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