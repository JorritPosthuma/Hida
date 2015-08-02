module.exports = (module) ->
  require('./logic/filters')(module)

  require('./parts/directives/dicom_controls')(module)
  require('./parts/directives/dicom_graph')(module)
  require('./parts/directives/dicom_hida_controls')(module)
  require('./parts/directives/dicom_hida_analysis')(module)
  require('./parts/directives/dicom_viewer')(module)

  require('./parts/export')(module)
  require('./parts/hida')(module)
  require('./parts/home')(module)
  require('./parts/login')(module)
  require('./parts/main')(module)
  require('./parts/nav')(module)

  module.run ($templateCache) ->
    $templateCache.put 'parts/nav.html', require './parts/nav.html'
    $templateCache.put 'parts/top.html', require './parts/top.html'