########################################
# Node Webkit
########################################

if global?.require?
  global.nw = global.require 'nw.gui'
  global.win = global.nw.Window.get()

  menu = new global.nw.Menu type: "menubar"
  menu.createMacBuiltin "Hida"
  global.win.menu = menu

  # Zoom to 75%
  # global.win.zoomLevel = Math.log(75 / 100) / Math.log 1.2