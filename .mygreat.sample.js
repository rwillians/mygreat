'use strict'

const memory = require('mygreat/adaptors/in-memory')

module.exports = async () => ({
  local: memory([
    {
      name: '01_foo',
      content: {
        up: async (db) => { },
        down: async (db) => { }
      }
    },
  ]),
  remote: memory([
    {
      name: 'f769ae4d-cf75-4831-a440-49970c293fae',
      content: [ '01_foo' ]
    }
  ]),
  setup: () => {
    return new Database('connection-string')
  }
})
