const request = require("request-promise")

const baseUri = "http://localhost:8081"

var r1 = {
  uri: baseUri,
  headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true
}

request(r1)
.then(function(results) {
  console.log(results)
})
