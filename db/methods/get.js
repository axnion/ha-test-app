const getClient   = require('./../client').getClient
const execute = require('./../client').execute

function run(id) {
  return execute(getClient(), "SELECT * FROM item_v" + db_version + " WHERE id = " + id + ";")
}

module.exports = {
  run: run
}
