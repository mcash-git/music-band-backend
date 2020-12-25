'use strict'

const BaseValidator = require('./BaseValidator')

class StoreArticle extends BaseValidator {
  get rules () {
    return {
      title: 'required|string|max:200',
      body: `required|string|max:20000`
    }
  }
}

module.exports = StoreArticle
