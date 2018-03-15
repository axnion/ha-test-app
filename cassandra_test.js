const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: [ '10.0.10.22'],
  authProvider: new cassandra.auth.PlainTextAuthProvider('developer', 'devpassword')
})

client.execute(`CREATE KEYSPACE IF NOT EXISTS vq_ai_tracking WITH REPLICATION = { ‘class’ : ‘SimpleStrategy’, ‘replication_factor’ : 1 };`)
.then(() =>
client.execute(`CREATE TABLE IF NOT EXISTS vq_ai_tracking.actions(userId uuid primary key);`,
(err, result) => {
    console.log(err, result);
}));

//const state = client.getState();
//console.log(state)
