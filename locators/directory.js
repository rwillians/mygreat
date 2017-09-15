'use strict'

const glob = require('glob')
const path = require('path')
const shasum = require('shasum')

module.exports = async (dir) => {
  return glob.sync(dir)
             .map(file => path.resolve(file))
             .map(file => {
               const { name } = path.parse(file)
               const instructions = require(file)
               const revision = shasum(instructions)
               return { name, instructions, revision }
             })
}
