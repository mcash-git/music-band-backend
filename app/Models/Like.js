'use strict'

const Model = use('Model')

/**
 * @swagger
 * definitions:
 *   NewLike:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       property_code:
 *         type: string
 *   Like:
 *     allOf:
 *       - $ref: '#/definitions/NewLike'
 *       - type: object
 *         properties:
 *           _id:
 *             type: string
 */
class Like extends Model {
  // timestamp
  static get createTimestamp () { return 'createdAt' }
  static get updateTimestamp () { return 'updatedAt' }

  user () {
    return this.belongsTo('App/Models/User')
  }

  post () {
    return this.belongsTo('App/Models/Post')
  }
}

module.exports = Like
