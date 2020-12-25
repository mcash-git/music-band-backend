'use strict'
const BaseController = use('App/Controllers/Http/Api/BaseController')
const Band = use('App/Models/Band')
const BandUser = use('App/Models/BandUser')
const Comment = use('App/Models/Comment')
const User = use('App/Models/User')
// const Validator = use('Validator')
const UnAuthorizeException = use('App/Exceptions/UnAuthorizeException')
const ValidateErrorException = use('App/Exceptions/ValidateErrorException')
// const Config = use('Config')
const Push = use('Adonis/Provider/Push')
const _ = require('lodash')
const ObjectID = require('mongodb').ObjectID
/**
 *
 * @class BandsController
 */
class BandsController extends BaseController {
  /**
   * Index
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf BandsController
   *
   */
  async index ({ request, response, decodeQuery }) {
    const decoded = decodeQuery()
    const search = request.input('search')
    if (search) {
      decoded.where.$or = [
        { name: new RegExp(`.*${search.toLowerCase()}.*`, 'i') }
      ]
    }
    const bands = await Band.query(decoded).limit(50).fetch()
    return response.apiCollection(bands)
  }

  /**
   * Store
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf BandsController
   *
   */
  async store ({ request, response, auth }) {
    const user = auth.user
    const band = new Band(request.only([
      'name',
      'genres',
      'province',
      'district',
      'instrument_ids'
    ]))
    band.user_id = user._id
    band.member_count = 1
    band.song_count = 0
    band.clip_count = 0
    band.follower_count = 1
    await band.save()
    await band.users().attach(ObjectID(user._id), row => { row.is_admin = true })
    return response.apiCreated(band)
  }

  /**
   * Show
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf BandsController
   *
   */
  async show ({ request, response, instance, decodeQuery }) {
    const band = instance
    const decoded = decodeQuery()
    if (decoded.with) {
      await band.loadMany(decoded.with)
    }
    return response.apiItem(band)
  }

  /**
   * Update
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf BandsController
   *
   */
  async update ({ request, response, params, instance, auth }) {
    // const bandId = params.id
    // await this.validateAttributes(request.all(), Band.rules(bandId))

    const band = instance
    // if (String(auth.user._id) !== String(band.user_id)) {
    //   throw UnAuthorizeException.invoke()
    // }
    band.merge(request.only(['name']))
    if (request.input('instrument_ids')) {
      band.instrument_ids = _.map(request.input('instrument_ids'), ObjectID)
    }
    await band.save()
    return response.apiUpdated(band)
  }

  /**
   * Destroy
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf BandsController
   *
   */
  async destroy ({ request, response, instance, auth }) {
    const band = instance
    // if (String(auth.user._id) !== String(band.user_id)) {
    //   throw UnAuthorizeException.invoke()
    // }
    const commentIds = await band.comments().ids()
    await Comment.where({ parent_id: { $in: commentIds } }).delete()
    await band.comments().delete()
    await band.delete()
    return response.apiDeleted()
  }

  /**
   * Upload
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf BandsController
   *
   */
  async uploadImage ({ request, response, instance, auth }) {
    const band = instance
    if (String(auth.user._id) !== String(band.user_id)) {
      throw UnAuthorizeException.invoke()
    }
    const cover = request.file('cover', {
      types: ['image'],
      size: '2mb'
    })
    if (!cover) {
      throw ValidateErrorException.invoke({ cover: 'cover field is required' })
    }
    const fileName = `${use('uuid').v1().replace(/-/g, '')}_${cover.clientName}`
    await cover.move(use('Helpers').publicPath('uploads/images'), { name: fileName })
    band.cover = `uploads/images/${fileName}`
    await band.save()
    // await band.related('images').load()
    return response.apiUpdated(band)
  }

  /**
   * Get songs of band
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf BandsController
   *
   */
  async songs ({ request, response, instance, decodeQuery }) {
    const band = instance
    const songs = await band.songs().query(decodeQuery()).fetch()
    return response.apiCollection(songs)
  }

  /**
   * Get users of band
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf BandsController
   *
   */
  async users ({ request, response, instance, decodeQuery }) {
    const band = instance
    const users = await band.users().fetch()
    return response.apiCollection(users)
  }

  /**
   * add user of band
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf BandsController
   *
   */
  async addUser ({ request, response, instance, auth }) {
    const band = instance
    const user = await User.find(request.input('user_id'))
    if (!user) {
      throw ValidateErrorException.invoke({ user_id: 'User Not Found' })
    }
    const exists = await BandUser.where({
      band_id: band._id,
      user_id: ObjectID(request.input('user_id'))
    }).first()
    if (!exists) {
      await BandUser.create({
        band_id: band._id,
        user_id: user._id,
        status: 'pending'
      })

      const messageBody = `${auth.user.name} invites you to join his/her band`
      const notification = {
        body: messageBody,
        custom: {
          key: 'NEW_INVITED',
          targetScreen: 'myProfileScreen'
        }
      }
      await Push.send([user._id], notification)
    }
    await band.load('users')
    response.apiSuccess(band)
  }

  /**
   * join a band by invited
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf BandsController
   *
   */
  async join ({ request, response, instance, auth }) {
    const band = instance
    const user = auth.user
    const bandUser = await BandUser.where({
      band_id: band._id,
      user_id: ObjectID(user._id),
      status: 'pending'
    }).first()
    if (bandUser) {
      bandUser.status = 'accepted'
      await bandUser.save()
      band.member_count = (band.member_count || 0) + 1
      await band.save()
    } else {
      throw ValidateErrorException.invoke({ invitation: 'Invitation Not Found' })
    }
    await band.load('users')
    response.apiSuccess(band)
  }

  /**
   * Follow a band
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
   */
  async follow ({ request, response, instance, auth }) {
    const band = instance
    const me = auth.user
    if (me.following_band_ids && _.map(me.following_band_ids, String).includes(band._id.toString())) {
      await me.followingBands().detach(band._id)
      band.follower_count && (band.follower_count = band.follower_count - 1)
    } else {
      await me.followingBands().attach(band._id)
      band.follower_count = (band.follower_count || 0) + 1
    }
    await band.save()
    return response.apiSuccess(me)
  }
}

module.exports = BandsController
