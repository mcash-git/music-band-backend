'use strict'

const Model = use('Model')

/**
 * @swagger
 * definitions:
 *   Conversation:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       type:
 *         type: string
 *         enum:
 *           - private
 *           - room
 *       muteIds:
 *         type: array
 *         items:
 *           type: string
 *       blockIds:
 *         type: array
 *         items:
 *           type: string
 *       lastMessage:
 *         $ref: '#/definitions/Message'
 *       userId:
 *         type: string
 *       venueId:
 *         type: string
 */
class Conversation extends Model {
  // timestamp
  static get createTimestamp () { return 'createdAt' }
  static get updateTimestamp () { return 'updatedAt' }

  static get rules () {
    return {
      type: 'required|in:private,room',
      target: 'required|objectId'
      // conversation_id: 'required|objectId'
    }
  }

  static get objectIDs () {
    return [
      '_id',
      'user_ids',
      'band_id'
    ]
  }

  users () {
    return this.referMany('App/Models/User')
  }

  band () {
    return this.belongsTo('App/Models/Band')
  }

  messages () {
    return this.hasMany('App/Models/Message')
  }

  images () {
    return this.hasMany('App/Models/Image')
  }
}

module.exports = Conversation
