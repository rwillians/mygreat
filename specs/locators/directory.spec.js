'use strict'

const path = require('path')
const directory = require('../../locators/directory')

describe('mygreat/locators', () => {
  describe('directory(path string) : array', () => {
    it('fetches all files and their content from a given directory', () => {
      return expect(directory('specs/stubs/*.js'))
        .to.eventually.shallowDeepEqual([
          { name: 'empty', instructions: { up: () => { }, down: () => { } } }
        ])
    })
  })
})
