'use strict'

const BaseValidator = require('./BaseValidator')

class StoreBand extends BaseValidator {
  get rules () {
    return {
      name: 'required|string|max:100',
      instrument_ids: 'required|array',
      genres: 'array'
    }
  }
}

module.exports = StoreBand
