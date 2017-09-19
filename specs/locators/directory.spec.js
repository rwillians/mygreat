'use strict'

const path = require('path')
const directory = require('../../locators/directory')

describe('mygreat/locators', () => {
  describe('directory(path String): Object', () => {
    describe('.locate(): Promise<Array[Object]>', () => {
      it('fetches all files and their content from a given directory', () => {
        return expect(directory('specs/stubs/migrations/*.js').locate())
          .to.eventually.shallowDeepEqual([
            { name: '20170914182600', content: { up: () => {}, down: () => {} } }
          ])
      })
    })
  })
})
