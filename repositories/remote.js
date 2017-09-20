'use strict'

const files = (migrations) => {
  return migrations.map(({ content }) => content)
                   .reduce((flat, files) => flat.concat(files))
}

module.exports = (locator) => ({
  all: async () => {
    return locator.locate()
  },
  count: async () => {
    return locator.locate()
                  .then(migrations => migrations.length)
  },
  files: async () => {
    return locator.locate()
                  .then(migrations => files(migrations))
  },
  synced: async (name) => {
    return locator.locate()
                  .then(migrations => files(migrations))
                  .then(files => files.includes(name))
  }
})
