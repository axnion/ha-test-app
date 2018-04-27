const executeRisky      = require('./../client').executeRisky
const getClient         = require('./../client').getClient
const getInitClient     = require('./../client').getInitClient
const doNothing         = require('./../client').doNothing

function run() {
  return executeRisky(getInitClient(), "CREATE KEYSPACE IF NOT EXISTS inventory WITH REPLICATION = { 'class': 'SimpleStrategy', 'replication_factor' : 3 }")
  .then(function() {
    return executeRisky(getClient(), "CREATE TABLE IF NOT EXISTS version ( id uuid PRIMARY KEY, table_name text, cur_version int, pre_version int )")
  })
  .then(function() {
    return executeRisky(getClient(), "SELECT * FROM version WHERE table_name='item' ALLOW FILTERING")
  })
  .then(function(results) {
    if (results.rowLength == 0) {
      id = cassandra.types.Uuid.random()
      return executeRisky(getClient(), "INSERT INTO version (id, table_name, cur_version, pre_version) VALUES (" + id + ", 'item', 0, 0)")
    } else {
      return doNothing()
    }
  })
}
