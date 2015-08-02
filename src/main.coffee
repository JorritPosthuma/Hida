# Load external libraries
require './lib'

# Load node-webkit checks
require './nw'

# Create angular module
module = angular.module "hida", [ require('angular-ui-router') ]

# Import angular components
require('./import')(module)

# Import routes
require('./logic/routes')(module)

# Import style
require './style/main.scss'