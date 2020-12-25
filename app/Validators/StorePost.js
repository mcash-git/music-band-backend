'use strict'

const BaseValidator = require('./BaseValidator')

class StoreArticle extends BaseValidator {
  get rules () {
    return {
      text: 'string|max:20000'
    }
  }
}

module.exports = StoreArticle
