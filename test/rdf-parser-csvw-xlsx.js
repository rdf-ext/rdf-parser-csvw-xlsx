import { strictEqual } from 'node:assert'
import { createReadStream } from 'node:fs'
import { describe, it } from 'mocha'
import rdf from 'rdf-ext'
import { datasetEqual } from 'rdf-test/assert.js'
import XlsxParser from '../index.js'

describe('rdf-parser-csvw-xlsx', () => {
  it('should be a constructor', () => {
    strictEqual(typeof XlsxParser, 'function')
  })

  it('should parse the XLSX file using the given metadata', async () => {
    const metadata = await rdf.io.dataset.fromURL(new URL('support/example.metadata.json', import.meta.url).pathname)
    const expected = await rdf.io.dataset.fromURL(new URL('support/example.sheet1.json', import.meta.url).pathname)
    const input = createReadStream(new URL('support/example.xlsx', import.meta.url).pathname)
    const parser = new XlsxParser({ factory: rdf })
    const stream = parser.import(input, {
      baseIRI: 'http://example.org/base',
      metadata,
      sheet: 'sheet1'
    })

    const result = await rdf.dataset().import(stream)

    datasetEqual(result, expected)
  })
})
