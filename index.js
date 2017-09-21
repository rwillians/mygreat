'use strict'

const uuid = require('uuid/v4')
const analyser = require('./analyser')
const ConflictError = require('./errors/conflict')
const MigrationError = require('./errors/migration')

const down = async (migrationRegistry, migrationFiles, args) => {
  //
}

const up = async (migrationFiles, args)  => {
  const migrationRegistry = { name: uuid(), content: [] }

  try {
    for (const migration of migrationFiles) {
      await migration.content.up(...args)
      migrationRegistry.content.push(migration.name)
    }
  } catch (err) {
    throw new MigrationError(err, migrationRegistry)
  }

  return migrationRegistry
}

module.exports = (local, remote) => ({
  up: async (...args) => {
    const collection = await analyser(local, remote).analyse()
    const conflicts = await collection.conflicting()

    if (conflicts.length > 0) {
      throw new ConflictError(conflicts)
    }

    const unsynced = await collection.unsynced()
    const migrations = await Promise.all(unsynced.map(async (migration) => {
      return local.fetch(migration.name)
    }))

    const migrationRegistry = await up(migrations, args)

    await remote.create(migrationRegistry.name, migrationRegistry.content)

    return migrationRegistry
  },
  down: async (...args) => {
    // const migrationRegistry = await down(local, remote, args)
  }
})
