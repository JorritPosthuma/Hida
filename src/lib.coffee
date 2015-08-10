# jQuery
window.jQuery = require 'jquery'
window.$ = window.jQuery

require 'script!cornerstone/dist/cornerstone.min.js'
require 'script!dicomParser/dist/dicomParser.min.js'
require 'script!cornerstoneWADOImageLoader/dist/cornerstoneWADOImageLoader.min.js'

require 'script!regression-js/build/regression.min.js'

# Q
window.Q = require 'q'
window.Q.longStackSupport = true

# Lodash
window._ = require 'lodash'

# Angular
require 'angular'

# Paper.JS
window.paper = require 'paper/dist/paper-core'