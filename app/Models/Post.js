'use strict'

const Model = use('Model')

/**
 * @swagger
 * definitions:
 *   NewPost:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       property_code:
 *         type: string
 *   Post:
 *     allOf:
 *       - $ref: '#/definitions/NewPost'
 *       - type: object
 *         properties:
 *           _id:
 *             type: string
 */
class Post extends Model {
  // timestamp
  static get createTimestamp () { return 'createdAt' }
  static get updateTimestamp () { return 'updatedAt' }

  static get objectIDs () { return ['_id', 'user_id', 'song_ids', 'viewer_ids'] }

  user () {
    return this.belongsTo('App/Models/User')
  }

  images () {
    return this.morphMany('App/Models/Image')
  }

  likes () {
    return this.morphMany('App/Models/Like')
  }

  comments () {
    return this.morphMany('App/Models/Comment')
  }

  songs () {
    return this.referMany('App/Models/Song')
  }

  viewers () {
    return this.referMany('App/Models/User', '_id', 'viewer_ids')
  }
}

module.exports = Post
