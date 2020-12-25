'use strict'
const BaseController = use('App/Controllers/Http/Api/BaseController')
const Song = use('App/Models/Song')
const Comment = use('App/Models/Comment')
// const Validator = use('Validator')
// const UnAuthorizeException = use('App/Exceptions/UnAuthorizeException')
// const ValidateErrorException = use('App/Exceptions/ValidateErrorException')
// const Config = use('Config')
const _ = require('lodash')
const ObjectID = require('mongodb').ObjectID
/**
 *
 * @class SongsController
 */
class SongsController extends BaseController {
  /**
   * Index
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf SongsController
   *
   */
  async index ({ request, response, decodeQuery }) {
    const decoded = decodeQuery()
    const search = request.input('search')
    if (search && search.length >= 3) {
      decoded.where.$or = [
        { name: new RegExp(`.*${search.toLowerCase()}.*`, 'i') }
      ]
    } else {
      return response.apiCollection([])
    }
    const songs = await Song.query(decoded).limit(50).fetch()
    return response.apiCollection(songs)
  }

  /**
   * Show
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf SongsController
   *
   */
  async show ({ request, response, instance, decodeQuery }) {
    const song = instance
    const decoded = decodeQuery()
    if (decoded.with) {
      await song.loadMany(decoded.with)
    }
    return response.apiItem(song)
  }

  /**
   * Update
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf SongsController
   *
   */
  async update ({ request, response, params, instance, auth }) {
    // const songId = params.id
    // await this.validateAttributes(request.all(), Song.rules(songId))

    const song = instance
    // if (String(auth.user._id) !== String(song.user_id)) {
    //   throw UnAuthorizeException.invoke()
    // }
    song.merge(request.only(['name']))
    if (request.input('instrument_ids')) {
      song.instrument_ids = _.map(request.input('instrument_ids'), ObjectID)
    }
    await song.save()
    return response.apiUpdated(song)
  }

  /**
   * Destroy
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf SongsController
   *
   */
  async destroy ({ request, response, instance, auth }) {
    const song = instance
    // if (String(auth.user._id) !== String(song.user_id)) {
    //   throw UnAuthorizeException.invoke()
    // }
    const commentIds = await song.comments().ids()
    await Comment.where({ parent_id: { $in: commentIds } }).delete()
    await song.comments().delete()
    await song.delete()
    return response.apiDeleted()
  }
}

module.exports = SongsController
