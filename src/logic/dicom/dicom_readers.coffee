DicomFile = require './dicom_file'
HermesRoiFile = require './hermes_roi_file'

class DicomReader

  constructor: (@frames = [], @rois = []) ->

  getFrame: (frame) =>
    @frames[frame - 1]

  getFrameCount: =>
    @frames.length

class DicomFileReader extends DicomReader

  constructor: (@paths) ->
    super()
    @files = []

  # abstract read(path)

  run: =>
    # For all paths
    promises = for path in @paths
      name = @pathToId path
      if _.endsWith name, '.hroi'
        # Read data
        @readString path
        # Process data
        .then (string) =>
          # Create new file
          file = new HermesRoiFile string, name
          # Parse frames
          file.parse()
          # Return file
          file
      else
        # Read data
        @readBuffer path
        # Process data
        .then (buffer) =>
          # Create new file
          file = new DicomFile buffer, name
          # Parse frames
          file.parse()

    Q.all promises
    .then (@files) =>
      @files.forEach (file) =>
        if file instanceof DicomFile
          Array.prototype.push.apply @frames, file.frames
        if file instanceof HermesRoiFile
          Array.prototype.push.apply @rois, file.rois
      @

class DicomFSReader extends DicomFileReader

  constructor: (paths) ->
    @fs = global.require 'fs'
    super paths

  pathToId: (path) => path

  readBuffer: (path) =>
    Q.nfcall @fs.readFile, path

  readString: (path) =>
    Q.nfcall @fs.readFile, path, 'utf-8'

class DicomHTML5Reader extends DicomFileReader

  constructor: (paths) ->
    super paths

  pathToId: (path) => path.name

  readBuffer: (path) => 
    deferred = Q.defer()
    reader = new FileReader()

    reader.onload = ->
      deferred.resolve reader.result
    reader.onerror = (error) ->
      deferred.reject error

    reader.readAsArrayBuffer path
    deferred.promise

  readString: (path) => 
    deferred = Q.defer()
    reader = new FileReader()

    reader.onload = ->
      deferred.resolve reader.result
    reader.onerror = (error) ->
      deferred.reject error

    reader.readAsText path
    deferred.promise

module.exports =
  DicomReader: DicomReader
  DicomFSReader: DicomFSReader
  DicomHTML5Reader: DicomHTML5Reader