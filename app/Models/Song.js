'use strict'

const Model = use('Model')

/**
 * @swagger
 * definitions:
 *   NewSong:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       genres:
 *         type: array
 *       album_id:
 *         type: string
 *       type:
 *         type: string
 *   Song:
 *     allOf:
 *       - $ref: '#/definitions/NewSong'
 *       - type: object
 *         properties:
 *           _id:
 *             type: string
 *           file:
 *             type: string
 *           image:
 *             type: string
 */
class Song extends Model {
  // timestamp
  static get createTimestamp () { return 'createdAt' }
  static get updateTimestamp () { return 'updatedAt' }

  static get ObjectIDs () { return ['_id', 'user_id', 'album_id', 'band_id'] }

  user () {
    return this.belongsTo('App/Models/User')
  }

  album () {
    return this.belongsTo('App/Models/Album')
  }

  band () {
    return this.belongsTo('App/Models/Band')
  }

  post () {
    return this.hasOne('App/Models/Band')
  }
}

module.exports = Song
