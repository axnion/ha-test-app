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
  item.id = cassandra.types.Uuid.random()
  return execute(getClient(), "INSERT INTO item_v1 (id, name) VALUES (" + item.id +", '" + item.name + "')")
}

function v2(item) {
  if (!item.number) {
    item.number = ""
  }

  item.id = cassandra.types.Uuid.random()
  return execute(getClient(), "INSERT INTO item_v2 (id, name, number) VALUES (" + item.id +", '" + item.name + "', '" + item.number + "')")
}

module.exports = {
  run: run
}
