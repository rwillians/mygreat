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

    describe('.all(): Array[Object]', () => {
      it('returns all analysed files\' results', () => {
        expect( collection.all() ).to.be.deep.equals(filesAnalyseResult)
      })
    })

    describe('.after(filename String): Promise<Array[Object]>', () => {
      it('returns all registered files after the given one', () => {
        return expect( collection.after('20170914182600') ).to.eventually.be.deep.equals([
          { name: '20170914202400', locations: [ 'remote', 'local' ] },
          { name: '20170914205000', locations: [ 'remote' ] },
          { name: '20170914210300', locations: [ 'remote', 'local' ] },
          { name: '20170914213400', locations: [ 'local' ] },
          { name: '20170914213500', locations: [ 'local' ] }
        ])
      })

      it('if the given file is the last one, an empty array will be returned', () => {
        return expect( collection.after('20170914213500') )
          .to.eventually.be.deep.equals([])
      })
    })

    describe('.before(filename String): Promise<Array[Object]>', () => {
      it('returns all registered files before the given one', () => {
        return expect( collection.before('20170914213500') ).to.eventually.be.deep.equals([
          { name: '20170914182600', locations: [ 'local' ] },
          { name: '20170914202400', locations: [ 'remote', 'local' ] },
          { name: '20170914205000', locations: [ 'remote' ] },
          { name: '20170914210300', locations: [ 'remote', 'local' ] },
          { name: '20170914213400', locations: [ 'local' ] },
        ])
      })

      it('if the given file is the first one, an empty array will be returned', () => {
        return expect( collection.before('20170914182600') )
          .to.eventually.be.deep.equals([])
      })
    })

    describe('.conflicting(): Promise<Array[Object]>', () => {
      it('returns all registered files which would cause conflicts', () => {
        return expect( collection.conflicting() ).to.eventually.be.deep.equals([
          { name: '20170914182600', locations: [ 'local' ] },
          { name: '20170914205000', locations: [ 'remote' ] }
        ])
      })
    })

    describe('.synced(): Promise<Array[Object]>', () => {
      it('returns all registered files which are sync from both local and remote', () => {
        return expect( collection.synced() ).to.eventually.be.deep.equals([
          { name: '20170914202400', locations: [ 'remote', 'local' ] },
          { name: '20170914210300', locations: [ 'remote', 'local' ] },
        ])
      })
    })

    describe('.unsynced(): Promise<Array[Object]>', () => {
      it('returns all registered files which are not sync from both local and remote', () => {
        return expect( collection.unsynced() ).to.eventually.be.deep.equals([
          { name: '20170914182600', locations: [ 'local' ] },
          { name: '20170914205000', locations: [ 'remote' ] },
          { name: '20170914213400', locations: [ 'local' ] },
          { name: '20170914213500', locations: [ 'local' ] }
        ])
      })
    })
  })
})
