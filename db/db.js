const initRunner    = require("./methods/init")
const addRunner     = require("./methods/add")
const getallRunner  = require("./methods/getall")
const getRunner     = require("./methods/get")
const updateRunner  = require("./methods/update")
const removeRunner  = require("./methods/remove")

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
