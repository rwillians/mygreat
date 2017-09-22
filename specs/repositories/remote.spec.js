'use strict'

const sinon = require('sinon')
const memory = require('../../adaptors/in-memory')
const remote = require('../../repositories/remote')

describe('mygreate/repositories', () => {
  const adaptor = memory([
    {
      name: '729185ad-1041-4423-9044-2a80a7c13c4e',
      content: [
        '20170914182600'
      ]
    },
    {
      name: '832185ad-1041-2343-2342-2a80a7c23c4b',
      content: [
        '20170914202400',
        '20170914210300'
      ]
    }
  ])

  describe('remote(adaptor Object): Object', () => {
    const repository = remote(adaptor)

    describe('.all(): Promise<Array[Object]>', () => {
      it('returns all remote migrations registries found by the adaptor', () => {
        return expect( repository.all() ).to.eventually.shallowDeepEqual([
          {
            name: '729185ad-1041-4423-9044-2a80a7c13c4e',
            content: [
              '20170914182600'
            ]
          },
          {
            name: '832185ad-1041-2343-2342-2a80a7c23c4b',
            content: [
              '20170914202400',
              '20170914210300'
            ]
          }
        ])
      })
    })

    describe('.count(): Promise<Number>', () => {
      it('number of migrations registries found by the adaptor', () => {
        return expect( repository.count() ).to.eventually.be.equals(2)
      })
    })

    describe('.add(name String, content Array[Object]): Promise', () => {
      it('creates a remote entry', () => {
        const spy = { add: sinon.spy() }
        const repo = remote(spy)

        return expect( repo.add('foo', []).then(() => spy.add.called) )
          .to.eventually.be.equals(true)
      })
    })

    describe('.remove(name String): Promise', () => {
      it('removes a given entry by its name', () => {
        const spy = { remove: sinon.spy() }
        const repo = remote(spy)

        return expect( repo.remove('foo').then(() => spy.remove.called) )
          .to.eventually.be.equals(true)
      })
    })

    describe('.files(): Promise<Array[String]>', () => {
      it('array of files flatted from migrations registries', () => {
        return expect( repository.files() ).to.eventually.be.deep.equals([
          '20170914182600',
          '20170914202400',
          '20170914210300'
        ])
      })
    })

    describe('.synced(filename String): Promise<Boolean>', () => {
      it('returns true if the given filename with the given revision is present on the remote migrations registries', () => {
        return expect( repository.synced('20170914182600') )
          .to.eventually.be.equals(true)
      })

      it('returns false if the given filename with the given revision is not present on the remote migrations registries', () => {
        return expect( repository.synced('20170914213500') )
          .to.eventually.be.equals(false)
      })
    })
  })
})
