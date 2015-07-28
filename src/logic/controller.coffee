class DefaultController extends EventBus

  constructor: (@scope, @root) ->
    super()
    @scope.root = @root
    @scope.ctrl = @

    @init()

    @scope.$on '$destroy', @destroy

  init: ->

  destroy: ->