const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: [ '10.0.10.22'],
  authProvider: new cassandra.auth.PlainTextAuthProvider('developer', 'devpassword')
})

const state = client.getState();

console.log(state)
