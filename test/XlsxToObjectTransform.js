import { strictEqual } from 'node:assert'
import { createReadStream } from 'node:fs'
import { describe, it } from 'mocha'
import chunks from 'stream-chunks/chunks.js'
import XlsxToObjectTransform from '../lib/XlsxToObjectTransform.js'

describe('XlsxToObjectTransform', () => {
  it('should be a constructor', () => {
    strictEqual(typeof XlsxToObjectTransform, 'function')
  })

  it('should transform a XLSX stream to an object stream', async () => {
    const input = createReadStream(new URL('support/example.xlsx', import.meta.url).pathname)
    const transform = new XlsxToObjectTransform()

    input.pipe(transform)

    const result = await chunks(transform)

    strictEqual(typeof result[0].row, 'object')
  })

  it('should transform a XLSX stream to an object stream with line number', async () => {
    const input = createReadStream(new URL('support/example.xlsx', import.meta.url).pathname)
    const transform = new XlsxToObjectTransform()

    input.pipe(transform)

    const result = await chunks(transform)

    strictEqual(result[0].line, 2)
  })

  it('should choose the first sheet', async () => {
    const input = createReadStream(new URL('support/example.xlsx', import.meta.url).pathname)
    const transform = new XlsxToObjectTransform()

    input.pipe(transform)

    const result = await chunks(transform)

    strictEqual(result[0].row.s0col0, 's0col0row0')
  })

  it('should parse the sheet with the given number', async () => {
    const input = createReadStream(new URL('support/example.xlsx', import.meta.url).pathname)
    const transform = new XlsxToObjectTransform({ sheet: 1 })

    input.pipe(transform)

    const result = await chunks(transform)

    strictEqual(result[0].row.s1col0, 's1col0row0')
  })

  it('should parse the sheet with the given number', async () => {
    const input = createReadStream(new URL('support/example.xlsx', import.meta.url).pathname)
    const transform = new XlsxToObjectTransform({ sheet: 'sheet1' })

    input.pipe(transform)

    const result = await chunks(transform)

    strictEqual(result[0].row.s1col0, 's1col0row0')
  })
})
