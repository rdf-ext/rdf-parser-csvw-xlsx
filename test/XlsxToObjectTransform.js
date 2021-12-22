const assert = require('assert')
const fs = require('fs')
const path = require('path')
const { describe, it } = require('mocha')
const XlsxToObjectTransform = require('../lib/XlsxToObjectTransform')

function streamToArray (stream) {
  return new Promise((resolve, reject) => {
    const array = []

    stream.on('data', data => {
      array.push(data)
    })

    stream.on('end', () => {
      resolve(array)
    })

    stream.on('error', reject)
  })
}

describe('XlsxToObjectTransform', () => {
  it('should be a constructor', () => {
    assert.strictEqual(typeof XlsxToObjectTransform, 'function')
  })

  it('should transform a XLSX stream to an object stream', () => {
    const input = fs.createReadStream(path.join(__dirname, 'support/example.xlsx'))
    const transform = new XlsxToObjectTransform()

    input.pipe(transform)

    return streamToArray(transform).then(array => {
      assert.strictEqual(typeof array.shift().row, 'object')
    })
  })

  it('should transform a XLSX stream to an object stream with line number', () => {
    const input = fs.createReadStream(path.join(__dirname, 'support/example.xlsx'))
    const transform = new XlsxToObjectTransform()

    input.pipe(transform)

    return streamToArray(transform).then(array => {
      assert.strictEqual(array.shift().line, 2)
    })
  })

  it('should choose the first sheet', () => {
    const input = fs.createReadStream(path.join(__dirname, 'support/example.xlsx'))
    const transform = new XlsxToObjectTransform()

    input.pipe(transform)

    return streamToArray(transform).then(array => {
      assert.strictEqual(array[0].row.s0col0, 's0col0row0')
    })
  })

  it('should parse the sheet with the given number', () => {
    const input = fs.createReadStream(path.join(__dirname, 'support/example.xlsx'))
    const transform = new XlsxToObjectTransform({ sheet: 1 })

    input.pipe(transform)

    return streamToArray(transform).then(array => {
      assert.strictEqual(array[0].row.s1col0, 's1col0row0')
    })
  })

  it('should parse the sheet with the given number', () => {
    const input = fs.createReadStream(path.join(__dirname, 'support/example.xlsx'))
    const transform = new XlsxToObjectTransform({ sheet: 'sheet1' })

    input.pipe(transform)

    return streamToArray(transform).then(array => {
      assert.strictEqual(array[0].row.s1col0, 's1col0row0')
    })
  })
})
