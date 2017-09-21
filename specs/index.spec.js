'use strict'

const sinon = require('sinon')
const index = require('../index')
const memory = require('../adaptors/memory')
const local = require('../repositories/local')
const remote = require('../repositories/remote')
const ConflictError = require('../errors/conflict')
const MigrationError = require('../errors/migration')

describe('mygreat(local Object, remote Object): Object', () => {
  const remoteInstance = remote(memory([{
    name: '832185ad-1041-2343-2342-2a80a7c23c4b',
    content: [
      '20170914202400',
    ]
  }]))

  const localInstance = local(memory([
    {
      name: '20170914202400',
      content: {
        up: (spies) => { spies['20170914202400'].up() },
        down: (spies) => { spies['20170914202400'].down() }
      }
    },
    {
      name: '20170914210100',
      content: {
        up: (spies) => { spies['20170914210100'].up() },
        down: (spies) => { spies['20170914210100'].down() }
      }
    },
    {
      name: '20170914210300',
      content: {
        up: (spies) => { spies['20170914210300'].up() },
        down: (spies) => { spies['20170914210300'].down() }
      }
    }
  ]))

  const mygreat = index(localInstance, remoteInstance)

  describe('.up(...args): Promise<Array[Object]>', () => {
    const mygreatConflict = index(localInstance, remote(memory([{
      name: '832185ad-1041-2343-2342-2a80a7c23c4b',
      content: [
        '20170914210300'
      ]
    }])))

    it('fails if there are any conflictable-unsynced migrations', () => {
      return expect( mygreatConflict.up(null) )
        .to.eventually.be.rejectedWith(ConflictError)
    })

    it('the error thrown in case of conflicts carries the array of conflicts', () => {
      return expect( mygreatConflict.up(null).catch(err => err.conflicts) )
        .to.eventually.be.an('array')
    })

    it('passes a given set of arguments to all unsynced migrations', () => {
      const arg = {
        '20170914202400': { up: sinon.spy(), down: sinon.spy() },
        '20170914210100': { up: sinon.spy(), down: sinon.spy() },
        '20170914210300': { up: sinon.spy(), down: sinon.spy() },
      }

      return expect(
        mygreat.up(arg)
               .then(() => Object.values(arg).map(m => ({
                  up: m.up.calledOnce,
                  down: m.down.calledOnce
               })))
      ).to.eventually.be.deep.equals([
        { up: false, down: false },
        { up: true, down: false },
        { up: true, down: false }
      ])
    })

    it('throw a MigrationException if an exception is thrown during the execution', () => {
      const crachable = index(local(memory([{
        name: '20170914210300',
        content: {
          up: async (instance) => { throw Error('expected error') },
          down: async (instance) => { }
        }
      }])), remote(memory([])))

      return expect( crachable.up({}) )
        .to.eventually.be.rejectedWith(MigrationError)
    })

    it('thrown MigrationException carries the migrationRegistry', () => {
      const crachable = index(local(memory([{
        name: '20170914210300',
        content: {
          up: async (instance) => { throw Error('expected error') },
          down: async (instance) => { }
        }
      }])), remote(memory([])))

      return expect( crachable.up({}).catch(err => err.migrationRegistry) )
        .to.eventually.be.shallowDeepEqual({ content: [] })
    })
  })
})
