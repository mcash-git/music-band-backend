'use strict'
const BaseController = use('App/Controllers/Http/Api/BaseController')
const User = use('App/Models/User')
// const Validator = use('Validator')
const UnAuthorizeException = use('App/Exceptions/UnAuthorizeException')
// const Config = use('Config')
const _ = require('lodash')
const ObjectID = require('mongodb').ObjectID
/**
 *
 * @class UsersController
 */
class UsersController extends BaseController {
  /**
   * Index
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
   */
  async index ({ request, response, decodeQuery }) {
    const users = await User.query(decodeQuery()).fetch()
    return response.apiCollection(users)
  }

  /**
   * search
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
   */
  async search ({ request, response, decodeQuery }) {
    const decoded = decodeQuery()
    const search = request.input('search')
    if (search && search.length >= 2) {
      decoded.where.$or = [
        { name: new RegExp(`.*${search.toLowerCase()}.*`, 'i') }
      ]
    } else {
      return response.apiCollection([])
    }
    const users = await User.query(decoded).limit(50).fetch()
    return response.apiCollection(users)
  }

  /**
   * suggested
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
   */
  async suggested ({ request, response, decodeQuery }) {
    const decoded = decodeQuery()
    const search = request.input('search')
    if (search && search.length >= 2) {
      decoded.where.name = new RegExp(`.*${search.toLowerCase()}.*`, 'i')
    }
    const users = await User.query(decoded).limit(10).fetch()
    return response.apiCollection(users)
  }

  /**
   * Store
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf UsersController
   *
   */
  // async store ({request, response}) {
  //   await this.validate(request.all(), User.rules())
  //   const user = new User(request.only('name', 'email'))
  //   const password = await Hash.make(request.input('password'))
  //   const verificationToken = crypto.createHash('sha256').update(uuid.v4()).digest('hex')
  //   user.set({
  //     password: password,
  //     verificationToken: verificationToken,
  //     verified: false
  //   })
  //   await user.save()
  //   await Mail.send('emails.verification', { user: user.get() }, (message) => {
  //     message.to(user.email, user.name)
  //     message.from(Config.get('mail.sender'))
  //     message.subject('Please Verify Your Email Address')
  //   })
  //   return response.apiCreated(user)
  // }

  /**
   * Show
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
   */
  async show ({ request, response, instance, decodeQuery }) {
    const user = instance
    const decoded = decodeQuery()
    if (decoded.with) {
      await user.loadMany(decoded.with)
    }
    return response.apiItem(user)
  }

  /**
   * Update
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf UsersController
   *
   */
  async update ({ request, response, params, instance, auth }) {
    // const userId = params.id
    // await this.validateAttributes(request.all(), User.rules(userId))

    const user = instance
    if (String(auth.user._id) !== String(user._id)) {
      throw UnAuthorizeException.invoke()
    }
    user.merge(request.only(['name', 'gender', 'birth_date', 'province', 'district']))
    if (request.input('instrument_ids')) {
      user.instrument_ids = _.map(request.input('instrument_ids'), ObjectID)
    }
    await user.save()
    return response.apiUpdated(user)
  }

  /**
   * Destroy
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
   */
  async destroy ({ request, response, instance, auth }) {
    const user = instance
    if (String(auth.user._id) !== String(user._id)) {
      throw UnAuthorizeException.invoke()
    }
    await user.delete()
    return response.apiDeleted()
  }

  /**
   * Upload
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
   */
  async upload ({ request, response, instance, auth }) {
    const user = instance
    if (String(auth.user._id) !== String(user._id)) {
      throw UnAuthorizeException.invoke()
    }
    const image = request.file('image', {
      types: ['image'],
      size: '2mb'
    })
    const fileName = `${use('uuid').v1().replace(/-/g, '')}_${image.clientName}`
    await image.move(use('Helpers').publicPath('uploads'), { name: fileName })
    const filePath = `uploads/${fileName}`
    await user.images().create({ fileName, filePath })
    if (request.input('is_avatar')) {
      user.avatar = filePath
      await user.save()
    }
    // await user.related('images').load()
    return response.apiUpdated(user)
  }

  /**
   * Get images of user
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
   */
  async images ({ request, response, instance, decodeQuery }) {
    const user = instance
    const images = await user.images().query(decodeQuery()).fetch()
    return response.apiCollection(images)
  }

  /**
   * Get posts of user
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
   */
  async posts ({ request, response, instance, decodeQuery }) {
    const user = instance
    const decoded = decodeQuery()
    if (request.input('search')) {
      // decoded.where.or = [
      //   { code: new RegExp(request.input('search'), 'i') },
      //   { name: new RegExp(request.input('search'), 'i') },
      //   { phone: new RegExp(request.input('search'), 'i') }
      // ]
    }
    const posts = await user.posts().query(decoded).fetch()
    return response.apiCollection(posts)
  }

  /**
   * Get bands of user
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
   */
  async bands ({ request, response, instance, decodeQuery }) {
    const user = instance
    const decoded = decodeQuery()
    if (request.input('search')) {
      // decoded.where.or = [
      //   { code: new RegExp(request.input('search'), 'i') },
      //   { name: new RegExp(request.input('search'), 'i') },
      //   { phone: new RegExp(request.input('search'), 'i') }
      // ]
    }
    const bands = await user.bands().query(decoded).fetch()
    return response.apiCollection(bands)
  }

  /**
   * Follow an user
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
   */
  async follow ({ request, response, instance, auth }) {
    const user = instance
    const me = auth.user
    if (auth.user.following_user_ids && _.map(auth.user.following_user_ids, String).includes(user._id.toString())) {
      await auth.user.followingUsers().detach(user._id)
      user.follower_count && (user.follower_count = user.follower_count - 1)
    } else {
      await me.followingUsers().attach(user._id)
      user.follower_count = (user.follower_count || 0) + 1
    }
    await user.save()
    return response.apiSuccess(me)
  }
}

module.exports = UsersController
