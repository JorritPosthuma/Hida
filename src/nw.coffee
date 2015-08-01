########################################
# Node Webkit
########################################

if global?.require?
  global.nw = global.require 'nw.gui'

  menu = new global.nw.Menu type: "menubar"
  menu.createMacBuiltin "Hida"
  global.nw.Window.get().menu = menu
