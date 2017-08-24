/* global describe, it */

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const rdf = require('rdf-ext')
const JsonLdParser = require('rdf-parser-jsonld')
const XlsxParser = require('..')

function datasetFromJsonLdFs (filename) {
  return rdf.dataset().import(JsonLdParser.import(fs.createReadStream(filename), {factory: rdf}))
}

describe('rdf-parser-csvw-xlsx', () => {
  it('should be a constructor', () => {
    assert.equal(typeof XlsxParser, 'function')
  })

  it('should parse the XLSX file using the given metadata', () => {
    return Promise.all([
      datasetFromJsonLdFs(path.join(__dirname, 'support/example.metadata.json')),
      datasetFromJsonLdFs(path.join(__dirname, 'support/example.sheet1.json'))
    ]).then((results) => {
      const metadata = results[0]
      const expected = results[1]

      const input = fs.createReadStream(path.join(__dirname, 'support/example.xlsx'))
      const parser = new XlsxParser({factory: rdf})
      const stream = parser.import(input, {
        baseIRI: 'http://example.org/base',
        metadata: metadata,
        sheet: 'sheet1'
      })

      return rdf.dataset().import(stream).then((dataset) => {
        assert.equal(dataset.toCanonical(), expected.toCanonical())
      })
    })
  })
})
