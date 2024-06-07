import ObjectParserTransform from 'rdf-parser-csvw/lib/ObjectParserTransform.js'
import XlsxToObjectTransform from './lib/XlsxToObjectTransform.js'

class Parser {
  constructor (options) {
    this.options = options
  }

  import (input, options) {
    options = { ...this.options, ...options }

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

export default Parser
