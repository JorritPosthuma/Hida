pip = require 'robust-point-in-polygon'
Q = require 'q'
_ = require 'lodash'

class ROI

  curve: (pixels, roi, resolution) ->
    @curveFromSimplePolygon pixels, roi.original, resolution

  curveFromSimplePolygon: (pixels, roi, resolution = 1) ->
    sums = pixels.map -> 0

    # Calculate size of original image
    size = Math.floor Math.sqrt pixels[0].length
    resolution = size * resolution

    # Calculate image scaling
    scale = resolution / size
    scaleq = scale * scale

    # Convert to PIP format
    data = _.map roi, (point) -> [point.x * resolution, point.y * resolution]

    # Loop through size of image
    for yi in [0 ... size]
      for xi in [0 ... size]
        mask = 0
        # Loop through resolution
        for yr in [0 ... scale]
          for xr in [0 ... scale]
            # Calculate relative point
            y = (yi * scale) + yr
            x = (xi * scale) + xr
            contains = pip data, [x, y]

            # < 0 only inside
            # <= 0 inside and border
            mask += 1 if contains <= 0

        # If there are any (sub) pixels that are part of the ROI
        if mask isnt 0
          index = yi * size + xi
          for frame, frame_id in pixels
            sums[frame_id] += frame[index] * mask / scaleq

    Q sums

instance = new ROI

Worker = require '../worker'
worker = new Worker instance, 'bundle/roi.bundle.js'
worker.wrap 'curveFromSimplePolygon'

module.exports = instance
