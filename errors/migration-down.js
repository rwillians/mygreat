'use strict'

const Error = require('./error')

module.exports = class extends Error {
  constructor (err, migrationRegistry, downedMigrations) {
    super(err.message)
    this.stack = err.stack
    this.downedMigrations = downedMigrations
    this.migrationRegistry = migrationRegistry
  }
}
