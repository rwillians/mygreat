'use strict'

const uuid = require('uuid/v4')
const analyser = require('./analyser')
const ConflictError = require('./errors/conflict')
const localRepository = require('./repositories/local')
const MigrationUpError = require('./errors/migration-up')
const remoteRepository = require('./repositories/remote')
const MigrationDownError = require('./errors/migration-down')

const conflictValidation = async (analysed) => {
  const conflicts = await analysed.conflicting()
  if (conflicts.length > 0) { throw new ConflictError(conflicts) }
}

const migrateDown = async (migrationRegistry, local, args) => {
  const migrationFiles = await local.fetchAll(migrationRegistry.content)
  const downedMigrations = []

  try {
    for (const migration of migrationFiles) {
      await migration.content.down(...args)
      downedMigrations.push(migration.name)
    }
  } catch (err) {
    throw new MigrationDownError(err, migrationRegistry, downedMigrations)
  }
}

const migrateUp = async (migrationFiles, args)  => {
  const migrationRegistry = { name: uuid(), content: [] }

  try {
    for (const migration of migrationFiles) {
      await migration.content.up(...args)
      migrationRegistry.content.push(migration.name)
    }
  } catch (err) {
    throw new MigrationUpError(err, migrationRegistry)
  }

  return migrationRegistry
}

const unsynced = async (analysed, local) => {
  const unsynced = await analysed.unsynced()
  return local.fetchAll(unsynced.map(migration => migration.name))
}

module.exports = (local, remote) => ({
  up: async (...args) => {
    const analysed = await analyser(local, remote).analyse()

    await conflictValidation(analysed)

    const migrations = await unsynced(analysed, local)
    const migrationRegistry = await migrateUp(migrations, args)

    if (migrationRegistry.content.length === 0) {
      return migrationRegistry
    }

    return remote.add(migrationRegistry.name, migrationRegistry.content)
                 .then(() => migrationRegistry)
  },
  down: async (...args) => {
    await analyser(local, remote).analyse()
                                 .then(conflictValidation)

    const latestMigration = await remote.all()
                                        .then(all => all.reverse().shift())

    if (!latestMigration) {
      return null
    }

    await migrateDown(latestMigration, local, args)
    await remote.remove(latestMigration.name)

    return latestMigration
  }
})

module.exports.from = (localAdaptor, remoteAdaptor) => {
  return module.exports(
    localRepository(localAdaptor),
    remoteRepository(remoteAdaptor),
  )
}
