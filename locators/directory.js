'use strict'

const glob = require('glob')
const path = require('path')
const shasum = require('shasum')
const omit = require('lodash.omit')
const merge = require('lodash.merge')

module.exports = async (dir) => {
  return glob.sync(dir)
             .map(relative => path.resolve(relative))
             .map(absolute => { path: absolute })
             .map(file => merge(file, { name: path.parse(file.path).name }))
             .map(file => merge(file, { content: require(file.path) }))
             .map(file => merge(file, { revision: shasum(file.content) }))
             .map(file => omit(file, 'path'))
}
