'use strict'

const path = require('path')
const memory = require('../../adaptors/memory')

describe('mygreat/adaptors', () => {
  const entries = [
    { name: '20170914182600', content: { up: () => {}, down: () => {} } }
  ]

  describe('memory(entries Array[Object]): Object', () => {
    const memoryInstance = memory(entries)

    describe('.locate(): Promise<Array[Object]>', () => {
      it('fetches all files and their content from a given array', () => {
        return expect(memoryInstance.locate())
          .to.eventually.shallowDeepEqual(entries)
      })
    })
  })
})
