'use strict'

const local = require('../../repositories/local')
const memory = require('../../adaptors/memory')

describe('mygreate/repositories', () => {
  const locator = memory([
    { name: '20170914142000', content: { up: () => {}, down: () => {} } },
    { name: '20170914182600', content: { up: () => {}, down: () => {} } },
  ])

  describe('local(locator Object): Object', () => {
    const repository = local(locator)

    describe('all(): Promise<Array[Object]>', () => {
      it('returns all migrations files found by the locator', () => {
        return expect( repository.all() ).to.eventually.shallowDeepEqual([
          { name: '20170914142000', content: { up: () => {}, down: () => {} } },
          { name: '20170914182600', content: { up: () => {}, down: () => {} } }
        ])
      })
    })

    describe('count(): Promise<Number>', () => {
      it('number of migrations files found by the locator', () => {
        return expect( repository.count() ).to.eventually.be.equals(2)
      })
    })

    describe('fetch(name String): Promise<Object>', () => {
      it('fetches a given migration file by its name', () => {
        return expect( repository.fetch('20170914182600') )
          .to.eventually.be.shallowDeepEqual(
            { name: '20170914182600', content: { up: () => {}, down: () => {} } }
          )
      })
    })
  })
})
