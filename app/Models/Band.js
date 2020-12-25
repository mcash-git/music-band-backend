'use strict'

const Model = use('Model')

/**
 * @swagger
 * definitions:
 *   NewBand:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       property_code:
 *         type: string
 *   Band:
 *     allOf:
 *       - $ref: '#/definitions/NewBand'
 *       - type: object
 *         properties:
 *           _id:
 *             type: string
 */
class Band extends Model {
  // timestamp
  static get createTimestamp () { return 'createdAt' }
  static get updateTimestamp () { return 'updatedAt' }

  users () {
    return this.belongsToMany('App/Models/User')
      .pivotModel('App/Models/BandUser')
      .withPivot(['is_admin', 'status'])
  }

  songs () {
    return this.hasMany('App/Models/Song')
  }

  conversation () {
    return this.hasOne('App/Models/Conversation')
  }
}

module.exports = Band
