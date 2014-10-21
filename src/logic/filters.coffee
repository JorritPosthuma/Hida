module = angular.module 'hida'

module.filter 'log',   -> (data) -> console.log data
module.filter 'print', -> (data) -> JSON.stringify data