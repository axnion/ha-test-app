const getClient   = require('./../client').getClient
const execute     = require('./../client').execute
const db_version  = require('./../db_version')

function run(item) {
  if (db_version == 1) {
    return v1(item)
  } else if(db_version == 2) {
    return v2(item)
  }
}

function v1(item) {
  return execute(getClient(), "UPDATE item_v1 SET name = '" + item.name + "' WHERE id = " + item.id + ";")
}

function v2(item) {
  if (!item.number) {
    item.number = ""
  }

  return execute(getClient(), "UPDATE item_v2 SET name = '" + item.name + "', number = '" + item.number + "' WHERE id = " + item.id + ";")
}

module.exports = {
  run: run
}
