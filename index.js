const assign = require('lodash/assign')
const ObjectParserTransform = require('rdf-parser-csvw/lib/ObjectParserTransform')
const XlsxToObjectTransform = require('./lib/XlsxToObjectTransform')

class Parser {
  constructor (options) {
    this.options = options
  }

  import (input, options) {
    options = assign({}, this.options, options)

    const reader = new XlsxToObjectTransform(options)
    const output = new ObjectParserTransform(options)

    input.on('end', () => {
      if (!output.readable) {
        output.emit('end')
      }
    })

    input.on('error', err => {
      output.emit('error', err)
    })

    input.pipe(reader).pipe(output)

    return output
  }

  static import (input, options) {
    return (new Parser(options)).import(input)
  }
}

module.exports = Parser
