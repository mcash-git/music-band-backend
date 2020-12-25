'use strict'

const Model = use('Model')

/**
 * @swagger
 * definitions:
 *   NewAlbum:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       instrument_ids:
 *         type: string
 *       band_id:
 *         type: string
 *   Album:
 *     allOf:
 *       - $ref: '#/definitions/NewAlbum'
 *       - type: object
 *         properties:
 *           _id:
 *             type: string
 *           user_id:
 *             type: string
 *           cover:
 *             type: string
 */
class Album extends Model {
  // timestamp
  static get createTimestamp () { return 'createdAt' }
  static get updateTimestamp () { return 'updatedAt' }

  static get objectIDs () { return ['_id', 'user_id', 'band_id', 'instrument_ids'] }

  user () {
    return this.belongsTo('App/Models/User')
  }

  band () {
    return this.belongsTo('App/Models/Band')
  }

  instruments () {
    return this.referMany('App/Models/Instrument')
  }
}

module.exports = Album
