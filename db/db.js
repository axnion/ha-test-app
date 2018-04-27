const init    = require("./migrations/init")
const add     = require("./migrations/add")
const getall  = require("./migrations/getall")
const get     = require("./migrations/get")
const update  = require("./migrations/update")
const remove  = require("./migrations/remove")

function init() {
  init.run()
  .then(function() {
    return
  })
}

function add(item) {
  return add.run(item)
}

function getAll() {
  return getall.run()
}

function get(id) {
  return get.run(id)
}

function update(item) {
  return update.run(item)
}

function remove(id) {
  return remove.run(id)
}

function system() {
  return system.run()
}
