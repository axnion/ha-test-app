const cassandra   = require('cassandra-driver')
const config      = require('./config.js')
const db_version  = require('./db_version.js')


function init() {
  let cur_version

  executeRisky(getInitClient(), "CREATE KEYSPACE IF NOT EXISTS inventory WITH REPLICATION = { 'class': 'SimpleStrategy', 'replication_factor' : 3 }")
  .then(function() {
    return executeRisky(getClient(), "CREATE TABLE IF NOT EXISTS version ( id uuid PRIMARY KEY, table_name text, cur_version int, pre_version int )")
  })
  .then(function() {
    return executeRisky(getClient(), "SELECT * FROM version WHERE table_name='item' ALLOW FILTERING")
  })
  .then(function(results) {
    console.log(results.info)
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
    const id = results.rows[0].id
    cur_version = results.rows[0].cur_version

    if (cur_version < db_version) {
      return executeRisky(getClient(), "UPDATE version SET cur_version = " + db_version + ", pre_version = " + cur_version + " WHERE id = " + id )
      .then(function() {
        if (cur_version <= 1 && db_version >= 1) {
          return executeRisky(getClient(), "CREATE TABLE IF NOT EXISTS item_v1 ( id uuid PRIMARY KEY, name text)")
        } else {
          return doNothing()
        }
      })
      .then(function() {
        if (cur_version < 2 && db_version >= 2) {
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
        } else {
          return doNothing()
        }
      })
    } else {
      return doNothing()
    }
  })
}

/**
* ADD ITEM
* Database function for adding an item to the database.
*/
function add(item) {
  let query = "";
  item.id = cassandra.types.Uuid.random()

  if (db_version == 1) {
    query = "INSERT INTO item_v1 (id, name) VALUES (" + item.id +", '" + item.name + "')";
  } else if(db_version == 2) {
    query = "INSERT INTO item_v2 (id, name, number) VALUES (" + item.id +", '" + item.name + "', '" + item.number + "')"
  }

  return execute(getClient(), query)
}

/**
* GET ALL ITEMS
* Database function for getting all items in the database
*/
function get() {
  return execute(getClient(), "SELECT * FROM item_v" + db_version + ";")
}

/**
* GET ITEM
* Database function for getting a specific item based on an identifier
*/
function getById(id) {
  return execute(getClient(), "SELECT * FROM item_v" + db_version + " WHERE id = " + id + ";")
}

/**
* UPDATE
* Database function for updating a specific item in the database based on the identifier
*/
function update(item) {
  let query = "";

  if (db_version == 1) {
    query = "UPDATE item_v1 SET name = '" + item.name + "' WHERE id = " + item.id + ";";
  } else if(db_version == 2) {
    if (!item.number) {item.number = ""}
    query = "UPDATE item_v2 SET name = '" + item.name + "', number = '" + item.number + "' WHERE id = " + item.id + ";"
  }

  return execute(getClient(), query)
}

/**
* REMOVE
* Database function for deleteing/removing a specific item in the database based
* on the identifier
*/
function remove(id) {
  return execute(getClient(), "DELETE FROM item_v" + db_version + " WHERE id = " + id + ";")
}

/**
* TEST
* Database function returns data about the database cluster
*/
function test() {
  return execute(getClient(), 'SELECT * FROM system.local')
}

/**
* DATABASE EXECUTION FUNCTION
* Function for executing queries where the application should fail completely if
* there is a problem
*/
function executeRisky(client, query) {
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
      .then(function() {
        process.exit(1)
      })
    })
}

/**
* DATABASE EXECUTION FUNCTION
* Function for executing queries where we want the application to continue but
* the server should respons with error if something goes wrong.
*/
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

/**
* DATABASE CLIENT
* The default client used to execute queries to Cassandra
*/
function getClient() {
  return new cassandra.Client({
    contactPoints: config.db.contactPoints,
    keyspace: config.db.keyspace,
    authProvider: new cassandra.auth.PlainTextAuthProvider(config.db.user, config.db.pass)
  })
}

/**
* DATABASE CLIENT
* Client used when a keyspace has to be initialized.
*/
function getInitClient() {
  return new cassandra.Client({
    contactPoints: config.db.contactPoints,
    authProvider: new cassandra.auth.PlainTextAuthProvider(config.db.user, config.db.pass)
  })
}

/**
* Return a promise that does nothing.
*/
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
