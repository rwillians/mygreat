'use strict'

const memory = require('../../locators/memory')
const remote = require('../../repositories/remote')

describe('mygreate/repositories', () => {
  const locator = memory([
    {
      _id: '729185ad-1041-4423-9044-2a80a7c13c4e',
      files: [
        '20170914182600'
      ],
      createdAt: new Date('2017-09-14T20:56:53.000Z')
    },
    {
      _id: '832185ad-1041-2343-2342-2a80a7c23c4b',
      files: [
        '20170914202400',
        '20170914210300'
      ],
      createdAt: new Date('2017-09-19T19:46:50.000Z')
    }
  ])

  describe('remote(locator Object): Object', () => {
    const repository = remote(locator)

    describe('all(): Promise<Array[Object]>', () => {
      it('returns all remote migrations registries found by the locator', () => {
        return expect( repository.all() ).to.eventually.shallowDeepEqual([
          {
            _id: '729185ad-1041-4423-9044-2a80a7c13c4e',
            files: [
              '20170914182600'
            ],
            createdAt: new Date('2017-09-14T20:56:53.000Z')
          },
          {
            _id: '832185ad-1041-2343-2342-2a80a7c23c4b',
            files: [
              '20170914202400',
              '20170914210300'
            ],
            createdAt: new Date('2017-09-19T19:46:50.000Z')
          }
        ])
      })
    })

    describe('count(): Promise<Number>', () => {
      it('number of migrations registries found by the locator', () => {
        return expect( repository.count() ).to.eventually.be.equals(2)
      })
    })

    describe('files(): Promise<Array[String]>', () => {
      it('array of files flatted from migrations registries', () => {
        return expect( repository.files() ).to.eventually.be.deep.equals([
          '20170914182600',
          '20170914202400',
          '20170914210300'
        ])
      })
    })

    describe('synced(filename String): Promise<Boolean>', () => {
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
