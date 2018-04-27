const cassandra         = require('cassandra-driver')
const executeRisky      = require('./../client').executeRisky
const getClient         = require('./../client').getClient
const getInitClient     = require('./../client').getInitClient
const doNothing         = require('./../client').doNothing
const db_version        = require('./../db_version')

let id
let cur_version

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
  .then(function() {
    return executeRisky(getClient(), "SELECT * FROM version WHERE table_name='item' ALLOW FILTERING")
  })
  .then(function(results) {
    id = results.rows[0].id
    cur_version = results.rows[0].cur_version

    if (cur_version < db_version) {
      return migration()
    } else {
      return doNothing()
    }
  })
}

function migration() {
  return executeRisky(getClient(), "UPDATE version SET cur_version = " + db_version + ", pre_version = " + cur_version + " WHERE id = " + id )
  .then(function () {
    if (cur_version <= 1 && db_version >= 1) {
      return v1()
    } else {
      return doNothing()
    }
  })
  .then(function() {
    if (cur_version < 2 && db_version >= 2) {
      return v2()
    } else {
      return doNothing()
    }
  })
}

function v1() {
  return executeRisky(getClient(), "CREATE TABLE IF NOT EXISTS item_v1 ( id uuid PRIMARY KEY, name text)")
}

function v2() {
  return executeRisky(getClient(), "CREATE TABLE IF NOT EXISTS item_v2 ( id uuid PRIMARY KEY, name text, number text)")
  .then(function() {
    return executeRisky(getClient(), "SELECT * FROM item_v1")
  })
  .then(function(data) {
    var promises = []
    for (i = 0; i < data.rowLength; i++) {
      var promise = executeRisky(getClient(), "INSERT INTO item_v2 (id, name, number) VALUES (" + data.rows[i].id + ", '" + data.rows[i].name + "', '')")
      promises.push(promise)
    }

    return Promise.all(promises)
  })
}

module.exports = {
  run: run
}
