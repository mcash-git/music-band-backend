'use strict'

const BaseController = use('App/Controllers/Http/Api/BaseController')
const Message = use('App/Models/Message')
const Conversation = use('App/Models/Conversation')
const ResourceNotFoundException = use('App/Exceptions/ResourceNotFoundException')
const Ws = use('Ws')
// const ValidateErrorException = use('App/Exceptions/ValidateErrorException')
// const _ = use('lodash')
const Push = use('Adonis/Provider/Push')
// const uuid = use('uuid')
/**
 *
 * @class MessagesController
 */
class MessagesController extends BaseController {
  /**
   * Send a message
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf MessagesController
   *
   */
  async send ({ request, response, instance, auth }) {
    await this.validate(request.all(), Message.rules)
    const me = auth.user
    const conversation = await Conversation.find(request.input('conversation_id'))
    if (!conversation) {
      throw ResourceNotFoundException.invoke('target Not Found')
    }
    // const targetId = _.without(conversation.user_ids.map(String), String(me._id))[0]
    // if (conversation.type === 'private' && conversation.block_ids.map(String).indexOf(targetId) > -1) {
    //   throw ValidateErrorException.invoke({ type: 'target not found' })
    // }
    let imagePath = null
    if (request.file('image')) {
      const image = request.file('image', {
        types: ['image'],
        size: '2mb'
      })
      if (image) {
        const imageFileName = `${use('uuid').v1().replace(/-/g, '')}_${image.clientName}`
        await image.move(use('Helpers').publicPath('uploads/images'), { name: imageFileName })
        imagePath = `uploads/images/${imageFileName}`
      }
    }

    let message = await conversation.messages().create({
      user_id: me._id,
      type: request.input('type'),
      text: request.input('text'),
      location: request.input('location'),
      image: imagePath,
      status: 'new'
    })

    await message.load('user')
    message = message.toJSON()
    conversation.last_message = message
    conversation.last_activity = new Date()
    const unreadCount = conversation.unread_count || {}
    for (let userId of conversation.user_ids) {
      if (String(userId) !== String(me._id)) {
        unreadCount[String(userId)] = (unreadCount[String(userId)] || 0) + 1
      }
    }
    conversation.unread_count = unreadCount

    await conversation.save()
    message.unread_count = conversation.unread_count
    response.apiSuccess(message)

    for (const userId of conversation.user_ids) {
      const topic = Ws.getChannel('chat:*').topic(`chat:${userId}`)
      !!topic && topic.broadcast('message', message)
    }

    let userIds = []
    const users = await conversation.users().fetch()
    for (let user of users.rows) {
      if (String(user._id) !== String(me._id) && !user.disable_notification && !user.online) {
        userIds.push(user._id)
      }
    }
    const messageBody = message.type === 'text' ? message.text : `${me.name} send a photo`
    const notification = {
      body: `${me.name}: ${messageBody}`,
      custom: {
        id: message._id,
        key: 'RECEIVED_NEW_MESSAGE',
        targetScreen: 'messagesScreen',
        conversation: {
          ...conversation.toJSON(),
          users: users.toJSON()
        }
      }
    }
    await Push.send(userIds, notification)
  }

  /**
   * Destroy
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf MessagesController
   *
   */
  async destroy ({ request, response, instance }) {
    const message = instance
    await message.delete()
    return response.apiDeleted()
  }
}

module.exports = MessagesController
