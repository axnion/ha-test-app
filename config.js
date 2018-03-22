let config = {}

config.app = {}
config.app.host = "unknown"
config.app.port = 80

config.db = {}
config.db.contactPoints = ['127.0.0.1']
config.db.keyspace = "default"
config.db.user = "cassandra"
config.db.pass = "cassandra"


module.exports = config;
