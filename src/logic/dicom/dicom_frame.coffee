module.exports = class DicomFrame

  constructor: (@file, @id, @frame_nr, @image) ->

  # Method used to create new images based on this image (e.g. with merging multiple frames)
  derive: (data, max) ->
    new DicomFrame @file, @id, @frame_nr,
      imageId:            @image.imageId
      minPixelValue:      @image.minPixelValue
      maxPixelValue:      max
      slope:              @image.slope
      intercept:          @image.intercept
      windowCenter:       @image.windowCenter
      windowWidth:        @image.windowWidth
      render:             @image.render
      getPixelData:       -> data
      rows:               @image.rows
      columns:            @image.columns
      height:             @image.height
      width:              @image.width
      color:              @image.color
      columnPixelSpacing: @image.columnPixelSpacing
      rowPixelSpacing:    @image.rowPixelSpacing
      data:               @image.data
      invert:             @image.invert
      sizeInBytes:        @image.sizeInBytes
