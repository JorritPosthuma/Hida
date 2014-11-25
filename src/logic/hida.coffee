class Hida

  # sqrt ( l^2 + r^2 )
  reverseMergeFrames: (left, right) ->
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

  constructor: (@viewer) ->

    ########################################
    # Defaults
    ########################################

    @reader = @viewer.reader
    @rois   = @viewer.rois

    # Step 1 - Merge frames

    frame_count = @reader.getFrameCount()
    frame_count_result = frame_count / 2

    console.assert frame_count % 2 is 0, "Even frame count"

    # left_frame  = @reader.getFrame 1
    # right_frame = @reader.getFrame 37

    # @reverseMergeFrames left_frame, right_frame

    frames = for left in [1 .. frame_count_result] by 1
      right = (left + frame_count_result)

      left_frame  = @reader.getFrame left
      right_frame = @reader.getFrame right

      @reverseMergeFrames left_frame, right_frame

    @reader = new DicomReader frames
    @viewer.read @reader

    # @file   = @viewer.file
    # @image  = @file.image

    # @width = @image.width
    # @height = @image.width

    # console.info 'HIDA Start'
    # console.info "Image size: #{@width} x #{@height}"

    # console.info "#{@viewer.rois.length} ROI's"

    # data = @image.getPixelData()

    # @rois.forEach (roi) =>
    #   sum = 0
    #   counter = 0

    #   for x in [0...@width]
    #     for y in [0...@height]
    #       # Increment
    #       counter = counter + 1

    #       # Count
    #       if roi.contains x, y
    #         sum = sum + data[counter]

    #   console.info sum


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