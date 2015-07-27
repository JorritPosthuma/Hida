module.exports = (angular) ->

  angular.filter 'log',     -> (data) -> console.log data; data
  angular.filter 'print',   -> (data) -> JSON.stringify data

  angular.filter 'replace', -> (text, a, b) -> text.replace a, b