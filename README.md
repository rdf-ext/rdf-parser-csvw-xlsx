# rdf-parser-csvw-xlsx

[![build status](https://img.shields.io/github/actions/workflow/status/rdf-ext/rdf-parser-csvw-xlsx/test.yaml?branch=master)](https://github.com/rdf-ext/rdf-parser-csvw-xlsx/actions/workflows/test.yaml)
[![npm version](https://img.shields.io/npm/v/rdf-parser-csvw-xlsx.svg)](https://www.npmjs.com/package/rdf-parser-csvw-xlsx)

A CSV on the Web based XLSX (Excel file format) parser with [RDF/JS Stream interface](https://github.com/rdfjs/representation-task-force/).

Consult the [rdf-parser-csvw](https://github.com/rdf-ext/rdf-parser-csvw) documentation about usage, which provides the technical foundation of this parser.

Note that this parser is much slower and needs more memory than the pure CSV based parser. If you need performance, convert the data to CSV first and use the [rdf-parser-csvw](https://github.com/rdf-ext/rdf-parser-csvw) parser.
