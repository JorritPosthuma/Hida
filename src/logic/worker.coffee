Q = require 'q'

worker = global.importScripts?

class WorkerWrapper

  constructor: (@instance, @file) ->
    if worker
      global.onmessage = (e) =>
        console.info "Calling '#{e.data.method}' through Web Worker"
        @instance[e.data.method] e.data.args...
        .then (result) -> global.postMessage result

  wrap: (method) =>
    if not worker
      @instance[method] = (args...) =>
        deferred = Q.defer()
        worker = new Worker @file
        worker.onmessage = (e) -> deferred.resolve e.data
        worker.postMessage
          method: method
          args: args
        deferred.promise

module.exports = WorkerWrapper