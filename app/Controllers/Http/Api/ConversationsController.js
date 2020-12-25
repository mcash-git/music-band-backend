'use strict'

const BaseController = use('App/Controllers/Http/Api/BaseController')
const User = use('App/Models/User')
const Conversation = use('App/Models/Conversation')
const ValidateErrorException = use('App/Exceptions/ValidateErrorException')
const Config = use('Config')
const _ = require('lodash')

/**
 *
 * @class ConversationsController
 */
class ConversationsController extends BaseController {
  /**
     * Get list conversations
     *
     * @param {any} request
     * @param {any} response
     *
     * @memberOf ConversationsController
     *
     */
  async index ({ request, response, instance, decodeQuery }) {
    const user = instance
    console.log(decodeQuery())
    const conversations = await user.conversations().query(decodeQuery()).fetch()
    return response.apiCollection(conversations)
  }

  /**
   * Open Conversation
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf ConversationsController
   *
   */
  async show ({ request, response, auth, params }) {
    const user = auth.user
    const type = params.type
    const targetId = params.target
    if (type === 'room') {
      const target = await user.bands().where({ _id: targetId }).first()
      if (!target) {
        throw ValidateErrorException.invoke({ target: 'band not found' })
      }
      const conversation = await Conversation
        .where({ band_id: target._id })
        .first()
      if (!conversation) {
        return response.apiSuccess(null)
      }
      await conversation.loadMany(['users', 'band'])
      return response.apiSuccess(conversation)
    } else {
      const target = await User.find(targetId)
      if (!target) {
        throw ValidateErrorException.invoke({ target: 'user not found' })
      }
      const conversation = await Conversation
        .where({ $and: [{ user_ids: user._id }, { user_ids: target._id }, { type: 'private' }] })
        .first()
      if (!conversation) {
        return response.apiSuccess(null)
      }
      conversation.unread_count[String(user._id)] = 0
      await conversation.save()
      await conversation.load('users')
      return response.apiSuccess(conversation)
    }
  }

  /**
   * Open Conversation
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf ConversationsController
   *
   */
  async open ({ request, response, auth }) {
    await this.validateAttributes(request.all(), Conversation.rules)
    const user = auth.user
    const type = request.input('type')
    const targetId = request.input('target')
    if (user._id.toString() === targetId) {
      throw ValidateErrorException.invoke({ target: 'not found' })
    }
    if (type === 'room') {
      const target = await user.bands().with('users').where({ _id: targetId }).first()
      if (!target) {
        throw ValidateErrorException.invoke({ target: 'not found' })
      }
      let conversation = await Conversation
        .where({ band_id: target._id })
        .first()
      if (!conversation) {
        conversation = await target.conversation().create({
          user_ids: _.map(target.getRelated('users').rows, '_id'),
          unread_count: {},
          mute_ids: [],
          block_ids: [],
          type: type,
          friend: false
        })
      }
      await conversation.loadMany(['users', 'band'])
      return response.apiSuccess(conversation)
    } else {
      const target = await User.find(targetId)
      if (!target) {
        throw ValidateErrorException.invoke({ target: 'not found' })
      }
      let conversation = await Conversation
        .where({ $and: [{ user_ids: user._id }, { user_ids: target._id }, { type: 'private' }] })
        .first()
      if (!conversation) {
        conversation = await Conversation.create({
          user_ids: [user._id, target._id],
          mute_ids: [],
          block_ids: [],
          type: type,
          friend: false
        })
      }
      await conversation.loadMany(['users', 'band'])
      return response.apiSuccess(conversation)
    }
  }

  /**
   * Read conversation
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf ConversationsController
   *
   */
  async read ({ request, response, instance, auth }) {
    const conversation = instance
    // if (conversation.type === 'private') {
    //   await this.guard('read', conversation)
    // }
    conversation.unread_count[String(auth.user._id)] = 0
    await conversation.save()
    return response.apiCollection(conversation)
  }

  /**
   * Get messages of category
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf ConversationsController
   *
   */
  async messages ({ request, response, instance, decodeQuery }) {
    const conversation = instance
    // if (conversation.type === 'private') {
    //   await this.guard('read', conversation)
    // }
    console.log(decodeQuery())
    const messages = await conversation.messages().query(decodeQuery()).fetch()
    return response.apiCollection(messages)
  }

  /**
   * Get users of category
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf ConversationsController
   *
   */
  async users ({ request, response, instance }) {
    const conversation = instance
    const users = await conversation.users().fetch()
    return response.apiCollection(users)
  }

  /**
   * Upload image
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf ConversationsController
   *
   */
  async upload ({ request, response, instance }) {
    const conversation = instance
    const image = request.file('image', {
      types: ['image'],
      size: '2mb'
    })
    if (!image) {
      throw ValidateErrorException.invoke({ target: 'not found' })
    }
    const prefix = use('uuid').v1().replace(/-/g, '')
    const fileName = `${prefix}_${image.clientName}`
    const uploadPath = use('Helpers').publicPath('uploads')
    await image.move(uploadPath, { name: fileName })
    const filePath = `uploads/${fileName}`
    const img = await conversation.images().create({
      fileName,
      filePath,
      thumbs: ['msgSmall']
    })
    img.url = Config.get('app.baseUrl') + '/' + img.filePath
    return response.apiCreated(img)
  }

  /**
   * Get images of conversation
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf ConversationsController
   *
   */
  async images ({ request, response, instance, decodeQuery }) {
    const conversation = instance
    const images = await conversation.images().query(decodeQuery()).fetch()
    return response.apiCollection(images)
  }

  /**
   * Delete image
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf ConversationsController
   *
   */
  async deleteImage ({ request, response, instance }) {
    const conversation = instance
    const image = await conversation.images().find(request.param('imageId'))
    if (!image) {
      throw ValidateErrorException.invoke({ target: 'not found' })
    }
    await image.delete()
    return response.apiDeleted()
  }
}

module.exports = ConversationsController
