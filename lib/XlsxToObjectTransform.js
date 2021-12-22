const Transform = require('readable-stream').Transform
const xlsx = require('xlsx')

class XlsxToObjectTransform extends Transform {
  constructor (options) {
    super({
      objectMode: true
    })

    options = options || {}

    this.sheet = options.sheet || 0

    this.buffers = []
  }

  _transform (data, encoding, done) {
    this.buffers.push(data)

    done()
  }

  _flush (done) {
    const data = Buffer.concat(this.buffers)
    const workbook = xlsx.read(data, { type: 'buffer' })
    const sheetName = typeof this.sheet === 'number' ? workbook.SheetNames[this.sheet] : this.sheet
    const sheet = workbook.Sheets[sheetName]

    xlsx.utils.sheet_to_json(sheet).forEach((row, index) => {
      this.push({
        line: index + 2,
        row: row
      })
    })

    done()
  }
}

module.exports = XlsxToObjectTransform
