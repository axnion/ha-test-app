const cassandra   = require('cassandra-driver')
const config      = require('./config.js')

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
  getClient:      getClient,
  getInitClient:  getInitClient,
  executeRisky:   executeRisky,
  execute:        execute,
  doNothing:      doNothing
}
