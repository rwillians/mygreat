'use strict'

const sinon = require('sinon')
const index = require('../index')
const memory = require('../adaptors/in-memory')
const local = require('../repositories/local')
const remote = require('../repositories/remote')
const ConflictError = require('../errors/conflict')
const MigrationUpError = require('../errors/migration-up')
const MigrationDownError = require('../errors/migration-down')

describe('mygreat', () => {
  describe('.from(localAdaptor Object, remoteAdaptor Object): Object', () => {
    it('creates an instance of mygreat using built-in repositories', () => {
      const mygreat = index.from(memory([]), memory([]))

      expect( mygreat ).to.have.property('up')
      expect( mygreat ).to.have.property('down')
    })
  })
})

describe('mygreat(localRepository Object, remoteRepository Object): Object', () => {
  const localAdaptor = memory([
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
  ])

  describe('.up(...args): Promise<Object>', () => {
    const mygreatConflict = index(local(localAdaptor), remote(memory([{
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

    it('returns a migration registry', () => {
      const mygreat = index(local(memory([])), remote(memory([])))
      return expect( mygreat.up({}) ).to.eventually.have.property('content')
    })

    it('passes a given set of arguments to all unsynced migrations', () => {
      const mygreat = index(local(localAdaptor), remote(memory([{
        name: '832185ad-1041-2343-2342-2a80a7c23c4b',
        content: [
          '20170914202400',
        ]
      }])))

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

    it('none migrations are executed if everything is synced', () => {
      const mygreat = index(local(localAdaptor), remote(memory([{
        name: '832185ad-1041-2343-2342-2a80a7c23c4b',
        content: [
          '20170914202400',
          '20170914210100',
          '20170914210300'
        ]
      }])))

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
        { up: false, down: false },
        { up: false, down: false }
      ])
    })

    it('creates a new registry on remote repository on success, if at least one migration file has ran', () => {
      const adaptor = memory([{
        name: '832185ad-1041-2343-2342-2a80a7c23c4b',
        content: [
          '20170914202400',
        ]
      }])

      const mygreat = index(local(localAdaptor), remote(adaptor))

      const arg = {
        '20170914202400': { up: sinon.spy(), down: sinon.spy() },
        '20170914210100': { up: sinon.spy(), down: sinon.spy() },
        '20170914210300': { up: sinon.spy(), down: sinon.spy() },
      }

      return expect(
        mygreat.up(arg)
               .then(() => adaptor.all())
               .then(all => all.length)
      ).to.eventually.be.equals(2)
    })

    it('creates none new registry on remote repository on success when none migration files ran', () => {
      const adaptor = memory([{
        name: '832185ad-1041-2343-2342-2a80a7c23c4b',
        content: [
          '20170914202400',
          '20170914210100',
          '20170914210300'
        ]
      }])

      const mygreat = index(local(localAdaptor), remote(adaptor))

      const arg = {
        '20170914202400': { up: sinon.spy(), down: sinon.spy() },
        '20170914210100': { up: sinon.spy(), down: sinon.spy() },
        '20170914210300': { up: sinon.spy(), down: sinon.spy() },
      }

      return expect(
        mygreat.up(arg)
               .then(() => adaptor.all())
               .then(all => all.length)
      ).to.eventually.be.equals(1)
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
        .to.eventually.be.rejectedWith(MigrationUpError)
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

  describe('.down(...args): Promise<Object>', () => {
    it('takes the latest migration registry\'s files and pass the given arguments to their down methods', () => {
      const mygreat = index(local(memory([
        { name: '20170914202400', content: { down: async (spies) => spies['20170914202400'].down() } },
        { name: '20170914210100', content: { down: async (spies) => spies['20170914210100'].down() } },
      ])), remote(memory([{
        name: '832185ad-1041-2343-2342-2a80a7c23c4b',
        content: [
          '20170914202400',
          '20170914210100'
        ]
      }])))

      const arg = {
        '20170914202400': { up: sinon.spy(), down: sinon.spy() },
        '20170914210100': { up: sinon.spy(), down: sinon.spy() }
      }

      return expect(
        mygreat.down(arg)
               .then(() => Object.values(arg).map(m => ({
                  up: m.up.called,
                  down: m.down.called
               })))
      ).to.eventually.be.deep.equals([
        { up: false, down: true },
        { up: false, down: true }
      ])
    })

    it('removes the migration registry after the execution', () => {
      const remoteAdaptor = memory([{
        name: '832185ad-1041-2343-2342-2a80a7c23c4b',
        content: [
          '20170914202400',
          '20170914210100'
        ]
      }])

      const mygreat = index(local(memory([
        { name: '20170914202400', content: { down: async () => { } } },
        { name: '20170914210100', content: { down: async () => { } } },
      ])), remote(remoteAdaptor))

      return expect(
        mygreat.down(null)
               .then(() => remoteAdaptor.all())
      ).to.eventually.be.deep.equals([])
    })
  })
})
