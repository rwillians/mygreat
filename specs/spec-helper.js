'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const chaiShallowDeepEqual = require('chai-shallow-deep-equal')

global.expect = chai.use(chaiShallowDeepEqual)
                    .use(chaiAsPromised)
                    .expect

process.on('unhandledRejection', function(reason, promise){
    console.log({ event: 'UnhandledPromiseRejection', promise, reason })
    process.exit(1)
})
