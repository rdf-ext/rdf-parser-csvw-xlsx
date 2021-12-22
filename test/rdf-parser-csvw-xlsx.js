const assert = require('assert')
const fs = require('fs')
const path = require('path')
const JsonLdParser = require('@rdfjs/parser-jsonld')
const { describe, it } = require('mocha')
const rdf = require('rdf-ext')
const XlsxParser = require('..')

function datasetFromJsonLdFs (filename) {
  const parser = new JsonLdParser()

  return rdf.dataset().import(parser.import(fs.createReadStream(filename), { factory: rdf }))
}

describe('rdf-parser-csvw-xlsx', () => {
  it('should be a constructor', () => {
    assert.strictEqual(typeof XlsxParser, 'function')
  })

  it('should parse the XLSX file using the given metadata', () => {
    return Promise.all([
      datasetFromJsonLdFs(path.join(__dirname, 'support/example.metadata.json')),
      datasetFromJsonLdFs(path.join(__dirname, 'support/example.sheet1.json'))
    ]).then(results => {
      const metadata = results[0]
      const expected = results[1]

      const input = fs.createReadStream(path.join(__dirname, 'support/example.xlsx'))
      const parser = new XlsxParser({ factory: rdf })
      const stream = parser.import(input, {
        baseIRI: 'http://example.org/base',
        metadata: metadata,
        sheet: 'sheet1'
      })

      return rdf.dataset().import(stream).then(dataset => {
        assert.strictEqual(dataset.toCanonical(), expected.toCanonical())
      })
    })
  })
})
