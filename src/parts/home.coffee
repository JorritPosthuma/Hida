file = 'dicomfile:/Users/Jorrit/Development/Hida/app/data/test.dcm'

module = angular.module 'hida'
module.controller 'HomeController', ($scope, $rootScope) ->

  new class extends DefaultController

    ###########################
    # Instance variables      #
    ###########################

    ww: 0
    wl: 0

    ###########################
    # constructor & init      #
    ###########################

    constructor: ->
      super $scope, $rootScope

      $element = $('.dicom')
      element = $element[0]

      fs = require 'fs'

      cornerstone.enable element

      cornerstone.loadImage file
      .then (image) =>
        cornerstone.displayImage element, image
        viewport = cornerstone.getViewport element

        @ww = viewport.voi.windowWidth
        @wl = viewport.voi.windowCenter

        $element.mousedown (e) =>
          lastX = e.pageX
          lastY = e.pageY

          $(document).mousemove (e) =>
            deltaX = e.pageX - lastX
            deltaY = e.pageY - lastY
            lastX = e.pageX
            lastY = e.pageY
            viewport = cornerstone.getViewport(element)
            viewport.voi.windowWidth += (deltaX / viewport.scale)
            viewport.voi.windowCenter += (deltaY / viewport.scale)
            cornerstone.setViewport element, viewport

            @ww = Math.round viewport.voi.windowWidth
            @wl = Math.round viewport.voi.windowCenter
            @scope.$apply()

          $(document).mouseup (e) ->
            $(document).unbind "mousemove"
            $(document).unbind "mouseup"

    ###########################
    # Methods                 #
    ###########################