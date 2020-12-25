'use strict'

const Model = use('Model')

/**
 * @swagger
 * definitions:
 *   NewComment:
 *     type: object
 *     properties:
 *       text:
 *         type: string
 *   Comment:
 *     allOf:
 *       - $ref: '#/definitions/NewComment'
 *       - type: object
 *         properties:
 *           _id:
 *             type: string
 *           post_id:
 *             type: string
 *           user_id:
 *             type: string
 */
class Comment extends Model {
  // timestamp
  static get createTimestamp () { return 'createdAt' }
  static get updateTimestamp () { return 'updatedAt' }

  user () {
    return this.belongsTo('App/Models/User')
  }

  comments () {
    return this.morphMany('App/Models/Comment')
  }

  likes () {
    return this.morphMany('App/Models/Like')
  }
}

module.exports = Comment
