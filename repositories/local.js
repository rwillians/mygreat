'use strict'

const select = async (files, names) => {
  return files.filter(file => names.includes(file.name))
}

module.exports = (adaptor) => ({
  all: async () => {
    return adaptor.all()
  },
  count: async () => {
    return adaptor.all()
                  .then(files => files.length)
  },
  fetch: async (name) => {
    const files = await adaptor.all()
    return select(files, [name]).then(selected => selected.shift())
  },
  fetchAll: async (names) => {
    const files = await adaptor.all()
    return select(files, names)
  }
})
