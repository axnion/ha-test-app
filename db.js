const cassandra = require('cassandra-driver')

function init() {
  execute("CREATE KEYSPACE IF NOT EXISTS inventory WITH REPLICATION = { 'class': 'SimpleStrategy', 'replication_factor' : 3 }")
  .then(function() {
    execute("CREATE TABLE IF NOT EXISTS item ( id uuid PRIMARY KEY, name text )")
  })
}

function add(item) {
  item.id = cassandra.types.Uuid.random()
  return execute("INSERT INTO item JSON '" + JSON.stringify(item) +"';")
}

function get() {
  return execute("SELECT JSON * FROM item;")
}

function getById(id) {
  return execute("SELECT JSON * FROM item WHERE id = " + id + ";")
}

function update(item) {
  return execute("UPDATE item SET name = '" + item.name + "' WHERE id = " + item.id + ";")
}

function remove(id) {
  return execute("DELETE FROM item WHERE id = " + id + ";")
}

function test() {
  return execute('SELECT * FROM system.local')
}

function execute(query) {
  const client = getClient()
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
    contactPoints: [ '10.0.10.22'],
    keyspace: "inventory",
    authProvider: new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra')

  })
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
