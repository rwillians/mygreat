'use strict'

const Error = require('./error')

module.exports = class extends Error {
  constructor (conflicts) {
    super('Conflicts found')
    this.conflicts = conflicts
  }
}
