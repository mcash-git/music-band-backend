'use strict'
const BaseController = use('App/Controllers/Http/Api/BaseController')
const Album = use('App/Models/Album')
const Comment = use('App/Models/Comment')
const Song = use('App/Models/Song')
// const Validator = use('Validator')
const UnAuthorizeException = use('App/Exceptions/UnAuthorizeException')
const ValidateErrorException = use('App/Exceptions/ValidateErrorException')
// const Config = use('Config')
const _ = require('lodash')
const ObjectID = require('mongodb').ObjectID
/**
 *
 * @class AlbumsController
 */
class AlbumsController extends BaseController {
  /**
   * Index
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf AlbumsController
   *
   */
  async index ({ request, response, decodeQuery }) {
    const albums = await Album.query(decodeQuery()).fetch()
    return response.apiCollection(albums)
  }

  /**
   * Store
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf AlbumsController
   *
   */
  async store ({ request, response, auth }) {
    const user = auth.user
    const album = await user.albums().create(request.only([
      'name',
      'description',
      'band_id',
      'instrument_ids'
    ]))
    return response.apiCreated(album)
  }

  /**
   * Show
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf AlbumsController
   *
   */
  async show ({ request, response, instance, decodeQuery }) {
    const album = instance
    const decoded = decodeQuery()
    if (decoded.with) {
      await album.loadMany(decoded.with)
    }
    return response.apiItem(album)
  }

  /**
   * Update
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf AlbumsController
   *
   */
  async update ({ request, response, params, instance, auth }) {
    // const albumId = params.id
    // await this.validateAttributes(request.all(), Album.rules(albumId))

    const album = instance
    if (String(auth.user._id) !== String(album.user_id)) {
      throw UnAuthorizeException.invoke()
    }
    album.merge(request.only(['name']))
    if (request.input('instrument_ids')) {
      album.instrument_ids = _.map(request.input('instrument_ids'), ObjectID)
    }
    await album.save()
    return response.apiUpdated(album)
  }

  /**
   * Destroy
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf AlbumsController
   *
   */
  async destroy ({ request, response, instance, auth }) {
    const album = instance
    if (String(auth.user._id) !== String(album.user_id)) {
      throw UnAuthorizeException.invoke()
    }
    const commentIds = await album.comments().ids()
    await Comment.where({ parent_id: { $in: commentIds } }).delete()
    await album.comments().delete()
    await album.delete()
    return response.apiDeleted()
  }

  /**
   * Upload
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf AlbumsController
   *
   */
  async uploadImage ({ request, response, instance, auth }) {
    const album = instance
    if (String(auth.user._id) !== String(album.user_id)) {
      throw UnAuthorizeException.invoke()
    }
    const cover = request.file('cover', {
      types: ['image'],
      size: '2mb'
    })
    if (!cover) {
      throw ValidateErrorException.invoke({cover: 'cover field is required'})
    }
    const fileName = `${use('uuid').v1().replace(/-/g, '')}_${cover.clientName}`
    await cover.move(use('Helpers').publicPath('uploads/images'), { name: fileName })
    const filePath = `uploads/images/${fileName}`
    album.cover = filePath
    await album.save()
    // await album.related('images').load()
    return response.apiUpdated(album)
  }

  /**
   * Like/Unlike a album
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf AlbumsController
   *
   */
  async like ({ request, response, instance, auth }) {
    const album = instance
    const user = auth.user
    const isLike = request.input('like')
    let like = await album.likes().where({ user_id: user._id }).first()
    if (isLike) {
      if (!like) {
        await album.likes().create({ user_id: user._id })
        album.like_count = (album.like_count || 0) + 1
        await album.save()
      }
    } else {
      if (like) {
        await like.delete()
        album.like_count = (album.like_count || 0) - 1
        await album.save()
      }
    }
    await album.load('likes')
    return response.apiItem(album)
  }
}

module.exports = AlbumsController
