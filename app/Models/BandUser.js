'use strict'

const Model = use('Model')

class BandUser extends Model {
  static get collection () { return 'band_user' }
}

module.exports = BandUser
