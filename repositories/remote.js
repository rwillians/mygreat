'use strict'

const files = (migrations) => {
  return migrations.map(({ content }) => content)
                   .reduce((flat, files) => flat.concat(files), [])
}

module.exports = (adaptor) => ({
  all: async () => {
    return adaptor.all()
  },
  count: async () => {
    return adaptor.all()
                  .then(migrations => migrations.length)
  },
  add: async (name, content) => {
    return adaptor.add(name, content)
  },
  remove: async (name) => {
    return adaptor.remove(name)
  },
  files: async () => {
    return adaptor.all()
                  .then(migrations => files(migrations))
  },
  synced: async (name) => {
    return adaptor.all()
                  .then(migrations => files(migrations))
                  .then(files => files.includes(name))
  }
})
