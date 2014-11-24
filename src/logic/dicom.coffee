class AbstractDicomReader

  constructor: (@paths) ->
    @files = []
    @frames = []

  # abstract read(path)

  run: =>
    # For all paths

    promises = for path in @paths
      # Read data
      @read path
      # Process data
      .then (buffer) =>
        # Create new file
        file = new DicomFile buffer, @pathToId path
        # Parse frames
        file.parse()

    Q.all promises
    .then (@files) =>
      @files.forEach (file) =>
        Array.prototype.push.apply @frames, file.frames

  pathToId: (path) => path

  getFrame: (frame) =>
    @frames[frame - 1]

  getFrameCount: =>
    @frames.length

  isMultiFile: =>
    @files.length > 1

class DicomFSReader extends AbstractDicomReader

  constructor: (paths) ->
    @fs = require "fs"
    super paths

  read: (path) =>
    deferred = Q.defer()

    @fs.readFile path, (error, buffer) =>
      if error then deferred.reject error
      else deferred.resolve buffer

    deferred.promise

class DicomHTML5Reader extends AbstractDicomReader

  constructor: (paths) ->
    super paths

  pathToId: (path) => path.name

  read: (path) => 
    deferred = Q.defer()
    reader = new FileReader()

    reader.onload = ->
      deferred.resolve reader.result
    reader.onerror = (error) ->
      deferred.reject error

    reader.readAsArrayBuffer path
    deferred.promise