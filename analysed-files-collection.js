'use strict'

const after = async (files, name) => {
  const index = await indexOf(files, name)

  if (index === undefined) {
    return []
  }

  return files.filter((file, i) => i > index)
}

const before = async (files, name) => {
  const index = await indexOf(files, name)

  if (index === undefined) {
    return []
  }

  return files.filter((file, i) => i < index)
}

const indexOf = async (files, name) => {
  return files.map((file, i) => [ file.name, i ])
              .filter(([n, i]) => n === name)
              .map(([n, i]) => i)
              .shift()
}

const synced = async (files) => {
  return files.filter(file => file.locations.length === 2)
}

const unsynced = async (files) => {
  return files.filter(file => file.locations.length === 1)
}

module.exports = (files) => ({
  all: () => {
    return files
  },
  after: async (name) => {
    return after(files, name)
  },
  before: async (name) => {
    return before(files, name)
  },
  conflicting: async () => {
    const unsyncedFiles = await unsynced(files)

    const withConflicts = await Promise.all(unsyncedFiles.map(async (file) => {
      const afterFiles = await after(files, file.name)
      const afterSyncedFiles = await synced(afterFiles)
      return [file, afterSyncedFiles]
    }))

    return withConflicts.filter(([file, conflicts]) => conflicts.length > 0)
                        .map(([file, conflicts]) => file)
  },
  synced: async () => {
    return synced(files)
  },
  unsynced: async () => {
    return unsynced(files)
  }
})
