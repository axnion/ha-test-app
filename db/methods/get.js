const getClient   = require('./../client').getClient
const execute     = require('./../client').execute
const db_version  = require('./../db_version')

function run(id) {
  return execute(getClient(), "SELECT * FROM item_v" + db_version + " WHERE id = " + id + ";")
}

module.exports = {
  run: run
}
