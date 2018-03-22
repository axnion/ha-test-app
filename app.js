const express       = require('express')
const app           = express()
const bodyParser    = require('body-parser');
const config    = require('./config.js')

const db = require("./db")
db.init()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const port = process.env.PORT || 3000

var router = express.Router()

router.get("/", function(req, res) {
  res.json(config.app)
})

router.get("/status", function(req, res) {
  db.test().then(function(results) {
    res.json(results)
  })
})

router.get("/item", function(req, res) {
  db.get().then(function(results) {
    res.json(results)
  })
})

router.get("/item/:id", function(req, res) {
  db.getById(req.params.id).then(function(results) {
    res.json(results)
  })
})

router.post("/item", function(req, res) {
  db.add(req.body).then(function(results) {
    res.json(results)
  })
})

router.put("/item", function(req, res) {
  db.update(req.body).then(function(results) {
    res.json(results)
  })
})

router.delete("/item", function(req, res) {
  db.remove(req.body.id).then(function(results) {
    res.json(results)
  })
})

app.use("/", router)

app.listen(port)
console.log("Magic happens on port " + port)
