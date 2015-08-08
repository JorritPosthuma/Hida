pip = require 'robust-point-in-polygon'

global.onmessage = (e) ->

  polygon = [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ]

  console.log pip polygon, [1.5, 1.5]