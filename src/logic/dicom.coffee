class DicomFileReader

  colorInterpretations: [
    "RGB"
    "PALETTE COLOR" 
    "YBR_FULL" 
    "YBR_FULL_422"
    "YBR_PARTIAL_422" 
    "YBR_PARTIAL_420" 
    "YBR_RCT"
  ]

  isColorImage: (photoMetricInterpretation) =>
    -1 isnt @colorInterpretations.indexOf photoMetricInterpretation

  createImageObject: (dataSet, imageId) =>
    # make the image based on whether it is color or not
    photoMetricInterpretation = dataSet.string("x00280004")
    # x00280008 == Aantal frames
    isColor = @isColorImage photoMetricInterpretation

    if not isColor
      cornerstoneWADOImageLoader.makeGrayscaleImage imageId, dataSet, dataSet.byteArray, photoMetricInterpretation, 0
    else
      cornerstoneWADOImageLoader.makeColorImage imageId, dataSet, dataSet.byteArray, photoMetricInterpretation, 0

  loadImage: (imageId) =>
    deferred = $.Deferred()

    @fs = require("fs") if not @fs
    url = imageId.substring 10

    @fs.readFile url, (err, buffer) =>
      dataSet = dicomParser.parseDicom new Uint8Array buffer
      imagePromise = @createImageObject dataSet, imageId
      imagePromise.then deferred.resolve, -> deferred.reject()

    deferred

reader = new DicomFileReader
cornerstone.registerImageLoader "dicomfile", reader.loadImage