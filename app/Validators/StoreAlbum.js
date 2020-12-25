'use strict'

const BaseValidator = require('./BaseValidator')

class StoreArticle extends BaseValidator {
  get rules () {
    return {
      name: 'required|string|max:100',
      description: 'string|max:500',
      band_id: 'objectId',
      instrument_ids: 'array',
      'instrument_ids.*': 'objectId'
    }
  }
}

module.exports = StoreArticle
