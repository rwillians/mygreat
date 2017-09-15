'use strict'

module.exports = {
  up: async (instance) => { },
  down: async (instance) => { throw new Error('foo') }
}
