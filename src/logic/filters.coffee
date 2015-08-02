module.exports = (module) ->

  module.filter 'log',     -> (data) -> console.log data; data
  module.filter 'print',   -> (data) -> JSON.stringify data

  module.filter 'replace', -> (text, a, b) -> text.replace a, b