########################################
# Node Webkit
########################################

if global?.require?
  global.nw = global.require 'nw.gui'
  global.win = global.nw.Window.get()

  menu = new global.nw.Menu type: "menubar"
  if menu.createMacBuiltin?
    menu.createMacBuiltin "Hida"
    global.win.menu = menu

  # Enable to zoom NW view to to 75%
  # global.win.zoomLevel = Math.log(75 / 100) / Math.log 1.2
