DefaultController = require '../logic/controller'

module.exports = (module) ->
  module.controller 'HomeController', ($scope, $rootScope, $timeout) ->

    new class HomeController extends DefaultController

      ###########################
      # constructor             #
      ###########################

      constructor: ->
        super $scope, $rootScope
      
      ###########################
      # Bridge Methods          #
      ###########################

      setControls: (@controlsDir) => 
      setViewer:   (@viewerDir)   =>