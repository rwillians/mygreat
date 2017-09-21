'use strict'

module.exports = (adaptor) => ({
  all: async () => {
    return adaptor.locate()
  },
  count: async () => {
    return adaptor.locate()
                  .then(files => files.length)
  },
  fetch: async (name) => {
    const files = await adaptor.locate()
    return files.filter(file => file.name === name)
                .shift()
  }
})
