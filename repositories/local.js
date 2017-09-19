'use strict'

module.exports = (locator) => ({
  all: async () => {
    return locator.locate()
  },
  count: async () => {
    return locator.locate()
                  .then(files => files.length)
  }
})
