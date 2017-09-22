'use strict'

const path = require('path')
const memory = require('../../adaptors/in-memory')

describe('mygreat/adaptors', () => {
  const entries = [
    { name: '20170914182600', content: { up: () => {}, down: () => {} } }
  ]

  describe('in-memory(entries Array[Object]): Object', () => {
    const memoryInstance = memory(entries)

    describe('.all(): Promise<Array[Object]>', () => {
      it('fetches all files and their content from a given array', () => {
        return expect(memoryInstance.all())
          .to.eventually.shallowDeepEqual(entries)
      })
    })

    describe('.add(name String, content Array): Promise', () => {
      it('pushes a new entry', () => {
        const adaptor = memory([])

        return expect(
          adaptor.add('foo', {})
                 .then(() => adaptor.all())
                .then(all => all.length)
        ).to.eventually.be.equals(1)
      })
    })

    describe('.remove(name String): Promise', () => {
      it('removes an entry by its name', () => {
        const adaptor = memory([
          { name: 'foo', content: [] },
          { name: 'bar', content: [] },
          { name: 'baz', content: [] }
        ])

        return expect(
          adaptor.remove('bar')
                 .then(() => adaptor.all())
        ).to.eventually.be.deep.equals([
          { name: 'foo', content: [] },
          { name: 'baz', content: [] }
        ])
      })
    })
  })
})
