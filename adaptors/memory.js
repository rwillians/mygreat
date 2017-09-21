'use strict'

module.exports = (entries) => ({
  locate: async () => entries.map(({ name, content }) => ({ name, content })),
  create: async (name, content) => { entries.push({ name, content }) }
})
