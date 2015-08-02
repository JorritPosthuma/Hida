DefaultController = require '../logic/controller'

module.exports = (module) ->
  module.controller 'HomeController', ($scope, $rootScope, $timeout, $q) ->

    new class HomeController extends DefaultController

      ###########################
      # constructor             #
      ###########################

      constructor: ->
        super $scope, $rootScope

        @controlsDefer = $q.defer()
        @viewerDefer = $q.defer()
   
        $q.all [@controlsDefer.promise, @viewerDefer.promise]
        .then @start
      
      ###########################
      # Bridge Methods          #
      ###########################

      setControls: (@controlsDir) => @controlsDefer.resolve @controlsDir
      setViewer:   (@viewerDir)   => @viewerDefer.resolve @viewerDir