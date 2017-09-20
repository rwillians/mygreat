'use strict'

const analysedFileCollection = require('../analysed-files-collection')

describe('mygreate', () => {
  const filesAnalyseResult = [
    { name: '20170914182600', locations: [ 'local' ] },
    { name: '20170914202400', locations: [ 'remote', 'local' ] },
    { name: '20170914205000', locations: [ 'remote' ] },
    { name: '20170914210300', locations: [ 'remote', 'local' ] },
    { name: '20170914213400', locations: [ 'local' ] },
    { name: '20170914213500', locations: [ 'local' ] }
  ]

  describe('analysed-files-collection(filesAnalyseResult Array[Object]): Object', () => {
    const collection = analysedFileCollection(filesAnalyseResult)

    it('.all(): Array[Object]', () => {
      expect( collection.all() ).to.be.deep.equals(filesAnalyseResult)
    })
  })
})
