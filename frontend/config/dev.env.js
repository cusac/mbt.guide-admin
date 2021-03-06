var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SERVER_URI: '"http://localhost:8080"',
  WEBSOCKET_URI: '"ws://localhost:8080"',
  APP_URI: '"http://localhost:3001"'
  // APP_URI: '"https://appyapp.io"'
})
