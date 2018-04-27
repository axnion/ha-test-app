const initRunner    = require("./migrations/init")
const addRunner     = require("./migrations/add")
const getallRunner  = require("./migrations/getall")
const getRunner     = require("./migrations/get")
const updateRunner  = require("./migrations/update")
const removeRunner  = require("./migrations/remove")

function init() {
  initRunner.run()
  .then(function() {
    return
  })
}

function add(item) {
  return addRunner.run(item)
}

function getAll() {
  return getallRunner.run()
}

function get(id) {
  return getRunner.run(id)
}

function update(item) {
  return updateRunner.run(item)
}

function remove(id) {
  return removeRunner.run(id)
}

function system() {
  return systemRunner.run()
}
