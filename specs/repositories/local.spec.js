'use strict'

const local = require('../../repositories/local')
const directory = require('../../locators/directory')

describe('mygreate/repositories', () => {
  const locator = directory('specs/stubs/migrations/*.js')

  describe('local(locator Object): Object', () => {
    const repository = local(locator)

    describe('all(): Promise<Array[Object]>', () => {
      it('returns all migrations files found by the locator', () => {
        return expect(repository.all()).to.eventually.shallowDeepEqual([
          { name: '20170914182600', content: { up: () => {}, down: () => {} } }
        ])
      })
    })

    describe('count(): Promise<Number>', () => {
      it('number of migrations files found by the locator', () => {
        return expect(repository.count()).to.eventually.be.equals(5)
      })
    })
  })
})
