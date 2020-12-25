'use strict'

const Model = use('Model')

/**
 * @swagger
 * definitions:
 *   NewUser:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       property_code:
 *         type: string
 *   User:
 *     allOf:
 *       - $ref: '#/definitions/NewUser'
 *       - type: object
 *         properties:
 *           _id:
 *             type: string
 */
class User extends Model {
  // timestamp
  static get createTimestamp () { return 'createdAt' }
  static get updateTimestamp () { return 'updatedAt' }

  static get hidden () {
    return ['password', 'verified', 'verificationToken']
  }

  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'User.hashPassword')
  }

  tokens () {
    return this.hasMany('App/Models/Token')
  }

  pushTokens () {
    return this.hasMany('App/Models/PushToken')
  }

  images () {
    return this.morphMany('App/Models/Image')
  }

  posts () {
    return this.hasMany('App/Models/Post')
  }

  albums () {
    return this.hasMany('App/Models/Album')
  }

  instruments () {
    return this.referMany('App/Models/Instrument')
  }

  bands () {
    return this.belongsToMany('App/Models/Band')
      .pivotModel('App/Models/BandUser')
      .withPivot(['is_admin', 'status'])
  }

  conversations () {
    return this.hasMany('App/Models/Conversation', '_id', 'user_ids')
  }

  likes () {
    return this.hasMany('App/Models/Like')
  }

  followingUsers () {
    return this.referMany('App/Models/User', '_id', 'following_user_ids')
  }

  followingBands () {
    return this.referMany('App/Models/Band', '_id', 'following_band_ids')
  }
}

module.exports = User
