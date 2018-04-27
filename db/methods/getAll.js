const getClient   = require('./../client').getClient
const execute     = require('./../client').execute
const db_version  = require('./../db_version')

function run() {
  return execute(getClient(), "SELECT * FROM item_v" + db_version + ";")
}

module.exports = {
  run: run
}
