'use strict'

const sortBy = require('lodash.sortby')
const collection = require('./analysed-files-collection')

module.exports = (local, remote) => ({
  analyse: async () => {
    const remoteFiles = await remote.files()
    const localFiles = await local.all()
                                  .then(files => files.map(file => file.name))

    const filesWithTheirMappedOrigin = [
      remoteFiles.map(name => ({ name, origin: 'remote' })),
      localFiles.map(name => ({ name, origin: 'local' }))
    ].reduce((flat, files) => flat.concat(files))

    const files = Object.values(
       filesWithTheirMappedOrigin.reduce((obj, file) => {
          const { name, origin } = file
          obj[name] = obj[name] || { name, locations: [] }
          obj[name].locations.push(origin)
          return obj
       }, {})
    )

    return collection(sortBy(files, ['name']))
  }
})
