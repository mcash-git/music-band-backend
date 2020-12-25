'use strict'
const BaseController = use('App/Controllers/Http/Api/BaseController')
const Post = use('App/Models/Post')
const Comment = use('App/Models/Comment')
const Song = use('App/Models/Song')
const Band = use('App/Models/Band')
// const Validator = use('Validator')
const UnAuthorizeException = use('App/Exceptions/UnAuthorizeException')
const ValidateErrorException = use('App/Exceptions/ValidateErrorException')
// const Config = use('Config')
const _ = require('lodash')
const ObjectID = require('mongodb').ObjectID
/**
 *
 * @class PostsController
 */
class PostsController extends BaseController {
  /**
   * Index
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf PostsController
   *
   */
  async index ({ request, response, decodeQuery }) {
    const posts = await Post.query(decodeQuery()).fetch()
    return response.apiCollection(posts)
  }

  /**
   * Store
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf PostsController
   *
   */
  async store ({ request, response, auth }) {
    const user = auth.user
    const post = await user.posts().create(request.only('text'))
    return response.apiCreated(post)
  }

  /**
   * Show
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf PostsController
   *
   */
  async show ({ request, response, instance, decodeQuery }) {
    const post = instance
    const decoded = decodeQuery()
    if (decoded.with) {
      await post.loadMany(decoded.with)
    }
    return response.apiItem(post)
  }

  /**
   * Update
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf PostsController
   *
   */
  async update ({ request, response, params, instance, auth }) {
    // const postId = params.id
    // await this.validateAttributes(request.all(), Post.rules(postId))

    const post = instance
    if (String(auth.user._id) !== String(post.user_id)) {
      throw UnAuthorizeException.invoke()
    }
    post.merge(request.only(['name']))
    if (request.input('instrument_ids')) {
      post.instrument_ids = _.map(request.input('instrument_ids'), ObjectID)
    }
    await post.save()
    return response.apiUpdated(post)
  }

  /**
   * Destroy
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf PostsController
   *
   */
  async destroy ({ request, response, instance, auth }) {
    const post = instance
    if (String(auth.user._id) !== String(post.user_id)) {
      throw UnAuthorizeException.invoke()
    }
    const commentIds = await post.comments().ids()
    await Comment.where({ parent_id: { $in: commentIds } }).delete()
    await post.comments().delete()
    await post.delete()
    return response.apiDeleted()
  }

  /**
   * Upload
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf PostsController
   *
   */
  async uploadImage ({ request, response, instance, auth }) {
    const post = instance
    if (String(auth.user._id) !== String(post.user_id)) {
      throw UnAuthorizeException.invoke()
    }
    const caption = request.input('caption')
    const image = request.file('image', {
      types: ['image'],
      size: '2mb'
    })
    if (!image) {
      throw ValidateErrorException.invoke({ image: 'image field is required' })
    }
    const filename = `${use('uuid').v1().replace(/-/g, '')}_${image.clientName}`
    await image.move(use('Helpers').publicPath('uploads/images'), { name: filename })
    const file = `uploads/images/${filename}`
    await post.images().create({ file, caption })
    // await post.related('images').load()
    return response.apiUpdated(post)
  }

  /**
   * Upload
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf PostsController
   *
   */
  async uploadSong ({ request, response, instance, auth }) {
    const post = instance
    const { user } = auth
    if (String(user._id) !== String(post.user_id)) {
      throw UnAuthorizeException.invoke()
    }
    await this.validate(request.all(), {
      name: 'required',
      album_id: 'objectId',
      band_id: 'objectId',
      genres: 'array',
      type: 'string|in:video,audio'
    })

    const band = await Band.find(request.input('band_id'))
    if (!band) {
      throw ValidateErrorException.invoke({ band_id: 'Band not found' })
    }

    const songFile = request.file('song', {
      types: ['video', 'audio', 'mp3', 'mp4'],
      size: '20mb'
    })
    if (!songFile) {
      throw ValidateErrorException.invoke({ song: 'song field is required' })
    }
    const songFileName = `${use('uuid').v1().replace(/-/g, '')}_${songFile.clientName}`
    await songFile.move(use('Helpers').publicPath('uploads/songs'), { name: songFileName })
    const songPath = `uploads/songs/${songFileName}`

    const image = request.file('image', {
      types: ['image'],
      size: '2mb'
    })
    let imagePath
    if (image) {
      const imageFileName = `${use('uuid').v1().replace(/-/g, '')}_${image.clientName}`
      await image.move(use('Helpers').publicPath('uploads/images'), { name: imageFileName })
      imagePath = `uploads/images/${imageFileName}`
    }

    const song = new Song(request.only(['name', 'genres', 'type', 'album_id', 'band_id']))
    song.file = songPath
    song.image = imagePath
    song.user_id = auth.user._id
    await post.songs().save(song)
    if (song.type === 'video') {
      user.clip_count = (user.clip_count || 0) + 1
      band.clip_count = (band.clip_count || 0) + 1
    } else {
      user.song_count = (user.song_count || 0) + 1
      band.song_count = (band.song_count || 0) + 1
    }
    await user.save()
    await band.save()
    // await post.related('images').load()
    return response.apiUpdated(post)
  }

  /**
   * increase view
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf PostsController
   *
   */
  async view ({ request, response, instance, auth }) {
    const post = instance
    await post.viewers().attach(auth.user)
    // await post.related('images').load()
    return response.apiUpdated(post)
  }

  /**
   * Get images of post
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf PostsController
   *
   */
  async images ({ request, response, instance, decodeQuery }) {
    const post = instance
    const images = await post.images().query(decodeQuery()).fetch()
    return response.apiCollection(images)
  }

  /**
   * Like/Unlike a post
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf PostsController
   *
   */
  async like ({ request, response, instance, auth }) {
    const post = instance
    const user = auth.user
    const isLike = request.input('like')
    let like = await post.likes().where({ user_id: user._id }).first()
    if (isLike) {
      if (!like) {
        await post.likes().create({ user_id: user._id })
        post.like_count = (post.like_count || 0) + 1
        await post.save()
      }
    } else {
      if (like) {
        await like.delete()
        post.like_count = (post.like_count || 0) - 1
        await post.save()
      }
    }
    await post.load('likes')
    return response.apiItem(post)
  }

  /**
   * Add comment to a post
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf PostsController
   *
   */
  async addComment ({ request, response, instance, auth }) {
    const post = instance
    const user = auth.user
    await this.validate(request.all(), { text: 'required|max:1000' })
    const comment = await post.comments().create({
      user_id: user._id,
      text: request.input('text')
    })
    post.comment_count = (post.like_count || 0) + 1
    await post.save()
    return response.apiCreated(comment)
  }

  /**
   * Get comment of post
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf PostsController
   *
   */
  async getComments ({ request, response, instance, decodeQuery }) {
    const post = instance
    const comments = await post.comments().query(decodeQuery()).fetch()
    return response.apiCollection(comments)
  }
}

module.exports = PostsController
