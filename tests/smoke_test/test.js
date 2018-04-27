const request = require("request-promise")
const baseUri = "http://localhost:3000"

var r1 = {
  uri: baseUri,
  headers: {
    'User-Agent': 'Request-Promise'
  },
  json: true
}

var r2 = {
  uri: baseUri + "/item",
  headers: {
    'User-Agent': 'Request-Promise'
  },
  json: true
}

var r3 = {
  uri: baseUri + "/item",
  method: 'POST',
  headers: {
    'User-Agent': 'Request-Promise'
  },
  body: {
    name: 'AutomaticTestItem'
  },
  json: true
}

let entriesBefore = 0
let id

request(r1)
.then(function(results) {
  console.log("/")
  console.log(results)
  console.log("---------------------------------------------------------------")

  return request(r2)
})
.then(function(results) {
  entriesBefore = results.rowLength
  console.log("GET /item -----------------------------------------------------")
  console.log(results)
  return request(r3)
})
.then(function(results) {
  console.log("POST /item ----------------------------------------------------")
  console.log(results)

  return request(r2)
})
.then(function(results) {
  for (i = 0; i < results.rowLength; i++) {
    if (results.rows[i].name == "AutomaticTestItem") {
      id = results.rows[i].id
      break;
    }
  }

  console.log("GET /item")
  console.log(results)
  console.log("---------------------------------------------------------------")

  var r4 = {
    uri: baseUri + "/item",
    method: 'PUT',
    headers: {
      'User-Agent': 'Request-Promise'
    },
    body: {
      id: id,
      name: 'AwesomeAutomaticThingy'
    },
    json: true
  }

  return request(r4)
})
.then(function(results) {
  console.log("PUT /item")
  console.log(results)
  console.log("---------------------------------------------------------------")

  var r5 = {
    uri: baseUri + "/item/" + id,
    method: 'GET',
    headers: {
      'User-Agent': 'Request-Promise'
    },
    body: {
      id: id,
      name: 'AwesomeAutomaticThingy'
    },
    json: true
  }

  return request(r5)
})
.then(function(results) {
  console.log("GET /item/:id")
  console.log(results)
  console.log("---------------------------------------------------------------")

  if (results.rows[0].name != "AwesomeAutomaticThingy" || results.rows[0].id != id) {
    process.exit(1)
  }

  var r6 = {
    uri: baseUri + "/item/",
    method: 'DELETE',
    headers: {
      'User-Agent': 'Request-Promise'
    },
    body: {
      id: id,
    },
    json: true
  }

  return request(r6)
})
.then(function(results) {
  console.log("DELETE /item/:id")
  console.log(results)
  console.log("---------------------------------------------------------------")
})
.catch(function(err) {
  console.log(err)
  process.exit(1)
})
