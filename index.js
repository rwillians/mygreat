'use strict'

process.on('unhandledRejection', function(reason, promise){
  console.log({ event: 'UnhandledPromiseRejection', promise, reason })
  process.exit(1)
})

const glob = require('glob')
const path = require('path')
const uuid = require('uuid/v4')
const shasum = require('shasum')

// Schema
const repository = [
  {
    _id: '729185ad-1041-4423-9044-2a80a7c13c4e',
    files: [
      {
        name: '20170914182600',
        revision: '9ff70c7ec950dcba848d5e8f269b88d9e6300147'
      },
      {
        name: '20170914202400',
        revision: '333d09934bb9462e529e35d805dd3aaa55bbb0aa'
      }
    ],
    createdAt: new Date('2017-09-14T20:56:53.000Z')
  }
]


// Adapter ====================================================
const localMigrationFiles = async (dir) => {
  return glob.sync(dir)
             .map(file => path.resolve(file))
             .map(file => {
               const { name } = path.parse(file)
               const instructions = require(file)
               const revision = shasum(instructions)
               return { name, instructions, revision }
             })
}

const remoteMigrationFiles = async (remoteMigrations) => {
  return remoteMigrations
    .map(migration => migration.files)
    .reduce((flat, files) => flat.concat(files))
}

const getMigration = async (repo, name) => {
  return repo.filter(file => file.name === name)
             .shift()
}

const remoteUp = async (migrations, arg) => {
  const synced = []

  try {
    for (const migration of migrations) {
      console.error(`migrating ${migration.name}...`)
      await migration.instructions.up(arg)
      synced.push(migration)
    }

    return synced
  } catch (err) {
    console.error('Something went wrong!')
    console.error('    ', err.message)

    try {
      for (let i = synced.length - 1; synced.length > 0; i--) {
        const migration = synced[i]
        console.error(`rolling back ${migration.name}...`)
        await migration.instructions.down(arg)
        delete synced[i]
      }

      err.synced = []
      throw err
    } catch (err) {
      console.error('Something went SERIOUSLY wront!')
      console.error('We where unable to rollback all migrations.')
      console.error('    ', err.message)

      err.synced = synced
      throw err
    }
  }
}




// Core ========================================================

const same = async (remote, local) => {
  return remote.revision === local.revision
}

const up = async (remoteMigrations, localMigrationsFiles) => {
  if (localMigrationsFiles.length === 0) {
    throw new Error('nothing to migrate up')
  }

  const remoteMigrationsFiles = await remoteMigrationFiles(remoteMigrations)
  const newFiles = []
  for (const lfile of localMigrationsFiles) {
    const rfile = await getMigration(remoteMigrationsFiles, lfile.name)

    if (rfile) {
      console.log(`migration ${rfile.name} has already been migrated`, same(rfile, lfile) ? '' : '(WARNING: file has been changed!)')
      continue
    }

    console.log(`migration ${lfile.name} is new`)
    newFiles.push(lfile)
  }

  let synced = []
  let error = undefined
  try {
    synced = await remoteUp(newFiles, {})
  } catch (err) {
    error = err
    synced = err.synced
  }


  if (synced.length > 0) {
    repository.push({
      _id: uuid(),
      files: synced.map(f => ({ name: f.name, revision: f.revision })),
      createdAt: new Date()
    })
  }

  if (error) {
    throw error
  }
}


const down = async (remoteMigrations, localMigrationsFiles) => {
  if (remoteMigrations.length === 0) {
    throw new Error('nothing to migrate down')
  }

  const remoteMigrationsFiles = remoteMigrations.shift().files
}



;(async () => {
  try {
    const remoteMigrations = repository
    const localMigrationsFiles = await localMigrationFiles('samples/migrations/*.js')

    console.log('before up:', require('util').inspect(repository, false, null))
    await up(remoteMigrations, localMigrationsFiles)
    console.log('after up:', require('util').inspect(repository, false, null))
    await down(remoteMigrations, localMigrationsFiles)
    console.log('after down:', require('util').inspect(repository, false, null))
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
