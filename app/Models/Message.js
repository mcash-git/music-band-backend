'use strict'

const Model = use('Model')

/**
 * @swagger
 * definitions:
 *   NewMessage:
 *     type: object
 *     properties:
 *       type:
 *         type: string
 *         default: text
 *       text:
 *         type: string
 *       image:
 *         type: string
 *       status:
 *         type: string
 *         default: sent
 *       conversation_id:
 *         type: string
 *       messageId:
 *         type: string
 *
 *   Message:
 *     allOf:
 *       - $ref: '#/definitions/NewMessage'
 *       - type: object
 *         properties:
 *           _id:
 *             type: string
 *           user_id:
 *             type: string
 */
class Message extends Model {
  // timestamp
  static get createTimestamp () { return 'createdAt' }
  static get updateTimestamp () { return 'updatedAt' }

  // static boot () {
  //   super.boot()
  //   this.addHook('beforeCreate', 'App/Models/Hooks/Message.addStatus')
  // }

  static get rules () {
    return {
      type: 'in:text,image,link,location',
      conversation_id: 'required|objectId'
    }
  }

  static get objectIDs () {
    return [
      '_id',
      'user_id',
      'conversation_id'
    ]
  }

  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Message
