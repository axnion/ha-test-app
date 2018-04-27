const executeRisky      = require('./../client').executeRisky
const getClient         = require('./../client').getClient
const doNothing         = require('./../client').doNothing
const db_version        = require('./../db_version')
const migration         = require('./../methods/init').migration

migration()
.then(function() {
  process.exit(0)
})
.catch(function(err) {
  console.log(err)
  process.exit(1)
})
