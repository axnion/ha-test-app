const getClient   = require('./../client').getClient
const execute = require('./../client').execute

function run(id) {
  return execute(getClient(), "DELETE FROM item_v" + db_version + " WHERE id = " + id + ";")
}

module.exports = {
  run: run
}
