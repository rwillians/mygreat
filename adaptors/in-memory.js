'use strict'

module.exports = (migrations) => {
  const entries = migrations

  return {
    all: async () => {
      return entries.map(({ name, content }) => ({ name, content }))
    },
    add: async (name, content) => {
      entries.push({ name, content })
    },
    remove: async (name) => {
      const index = entries.map((entry, position) => [entry, position])
                           .filter(([entry, position]) => entry.name === name)
                           .map(([entry, position]) => position)
                           .shift()

      entries.splice(index, 1)
    }
  }
}
