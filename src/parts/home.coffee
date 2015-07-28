module = angular.module 'hida'
module.controller 'HomeController', ($scope, $rootScope, $timeout) ->

  new class HomeController extends DefaultController

    ###########################
    # constructor             #
    ###########################

    constructor: ->
      super $scope, $rootScope

      @controlsDefer = Q.defer()
      @viewerDefer = Q.defer()
 
      Q.all [@controlsDefer.promise, @viewerDefer.promise]
      .then @start
    
    ###########################
    # Bridge Methods          #
    ###########################

    setControls: (@controlsDir) => @controlsDefer.resolve @controlsDir
    setViewer:   (@viewerDir)   => @viewerDefer.resolve @viewerDir