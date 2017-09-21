'use strict'

const files = (migrations) => {
  return migrations.map(({ content }) => content)
                   .reduce((flat, files) => flat.concat(files), [])
}

module.exports = (adaptor) => ({
  all: async () => {
    return adaptor.locate()
  },
  count: async () => {
    return adaptor.locate()
                  .then(migrations => migrations.length)
  },
  create: async (name, content) => {
    return adaptor.create(name, content)
  },
  files: async () => {
    return adaptor.locate()
                  .then(migrations => files(migrations))
  },
  synced: async (name) => {
    return adaptor.locate()
                  .then(migrations => files(migrations))
                  .then(files => files.includes(name))
  }
})
