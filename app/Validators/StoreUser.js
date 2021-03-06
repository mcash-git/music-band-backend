'use strict'

const BaseValidator = require('./BaseValidator')

class StoreUser extends BaseValidator {
  get rules () {
    return {
      name: 'required|min:2|max:100',
      email: `required|email|unique:users,email`,
      password: 'required|min:6|max:255',
      company: 'string|max:200'
    }
  }
}

module.exports = StoreUser
