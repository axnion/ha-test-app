const getClient   = require('./../client').getClient

function run() {
  return execute(getClient(), 'SELECT * FROM system.local')
}

module.exports = {
  run: run
}
