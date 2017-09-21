'use strict'

const Error = require('./error')

module.exports = class extends Error {
  constructor (err, migrationRegistry) {
    super(err.message)
    this.stack = err.stack
    this.migrationRegistry = migrationRegistry
  }
}
