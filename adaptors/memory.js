'use strict'

module.exports = (migrations) => {
  const entries = migrations

  return {
    locate: async () => {
      return entries.map(({ name, content }) => ({ name, content }))
    },
    create: async (name, content) => {
      entries.push({ name, content })
    }
  }
}
