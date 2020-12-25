'use strict'

const Model = use('Model')

/**
 * @swagger
 * definitions:
 *   NewPushToken:
 *     type: object
 *     properties:
 *       device_token:
 *         type: string
 *       device_type:
 *         type: string
 *         enum:
 *           - android
 *           - ios
 *   PushToken:
 *     allOf:
 *       - $ref: '#/definitions/NewPushToken'
 *       - type: object
 *         properties:
 *           _id:
 *             type: string
 *           user_id:
 *             type: string
 *           badge:
 *             type: number
 *           status:
 *             type: string
 */
class PushToken extends Model {
  // timestamp
  static get createTimestamp () { return 'createdAt' }
  static get updateTimestamp () { return 'updatedAt' }
  // model constant
  static get TYPE_ANDROID () { return 'android' }
  static get TYPE_IOS () { return 'ios' }

  static get STATUS_ENABLED () { return 'enabled' }
  static get STATUS_DISABLED () { return 'disabled' }

  static get rules () {
    return {
      device_token: 'required|string',
      device_type: `required|string|in:${PushToken.TYPE_ANDROID},${PushToken.TYPE_IOS}`
    }
  }

  static get objectIDs () {
    return [
      '_id',
      'user_id'
    ]
  }
}

module.exports = PushToken
