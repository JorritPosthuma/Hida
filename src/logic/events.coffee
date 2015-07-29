class EventBus

  constructor: ->
    channels = {}

    @on = (name, callback) ->
      channels[name] = [] unless channels[name]?
      channels[name].push
        context: @
        callback: callback
   
    @emit = (name, data...) ->
      if channels[name]?
        for sub in channels[name]
          sub.callback.apply sub.context, data