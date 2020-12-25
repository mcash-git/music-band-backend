'use strict'

const BaseValidator = require('./BaseValidator')

class UpdateUser extends BaseValidator {
  get rules () {
    return {
      name: 'min:2|max:100',
      instrument_ids: 'array',
      'instrument_ids.*': 'objectId',
      gender: 'in:male,female,other'
    }
  }
}

module.exports = UpdateUser
