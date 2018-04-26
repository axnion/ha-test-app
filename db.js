const cassandra   = require('cassandra-driver')
const config      = require('./config.js')
const db_version  = require('./db_version.js')

function init() {
  //SELECT table_name FROM system_schema.tables WHERE keyspace_name='inventory';
  execute(getInitClient(), "CREATE KEYSPACE IF NOT EXISTS inventory WITH REPLICATION = { 'class': 'SimpleStrategy', 'replication_factor' : 3 }")
  .then(function() {
    return execute(getClient(), "CREATE TABLE IF NOT EXISTS version (id uuid PRIMARY KEY, table_name text, cur_version int, pre_version int )")
  })
  .then(function() {
    return execute(getClient(), "CREATE TABLE IF NOT EXISTS item ( id uuid PRIMARY KEY, name text )")
  })
  .then(function() {
    return execute(getClient(), "SELECT * FROM version WHERE table_name='item' ALLOW FILTERING")
  })
  .then(function(results) {
    if (!results) {
      return execute(getClient(), "INSERT INTO version (table_name, cur_version, pre_version) VALUES ('item', '0', '0')")
    } else {
      return doNothing()
    }
  })
  .then(function() {
    return execute(getClient(), "SELECT cur_version FROM version WHERE table_name='item' ALLOW FILTERING")
  })
  .then(function(results) {
    console.log(results)
  })
}

function add(item) {
  item.id = cassandra.types.Uuid.random()
  return execute(getClient(), "INSERT INTO item (name) VALUES (" + item.name + ")")
}

function get() {
  return execute(getClient(), "SELECT * FROM item;")
}

function getById(id) {
  return execute(getClient(), "SELECT JSON * FROM item WHERE id = " + id + ";")
}

function update(item) {
  return execute(getClient(), "UPDATE item SET name = '" + item.name + "' WHERE id = " + item.id + ";")
}

function remove(id) {
  return execute(getClient(), "DELETE FROM item WHERE id = " + id + ";")
}

function test() {
  return execute(getClient(), 'SELECT * FROM system.local')
}

function execute(client, query) {
  return client.connect()
    .then(function() {
      console.log("executing: " + query)
      return client.execute(query)
    })
    .then(function(results) {
      console.log("done")
      client.shutdown(results)
      return new Promise(function(resolve, reject) {
        resolve(results)
      })
    })
    .catch(function(err) {
      console.log("error: " + err)
      return client.shutdown()
    })
}

function getClient() {
  return new cassandra.Client({
    contactPoints: config.db.contactPoints,
    keyspace: config.db.keyspace,
    authProvider: new cassandra.auth.PlainTextAuthProvider(config.db.user, config.db.pass)
  })
}

function getInitClient() {
  return new cassandra.Client({
    contactPoints: config.db.contactPoints,
    authProvider: new cassandra.auth.PlainTextAuthProvider(config.db.user, config.db.pass)
  })
}

function doNothing() {
  return Promise.resolve("Doing nothing")
}

module.exports = {
  init:     init,
  add:      add,
  get:      get,
  getById:  getById,
  update:   update,
  remove:   remove,
  test:     test
}
