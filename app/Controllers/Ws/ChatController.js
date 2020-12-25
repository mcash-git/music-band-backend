'use strict'
const Conversation = use('App/Models/Conversation')
const ValidateErrorException = use('App/Exceptions/ValidateErrorException')
const Ws = use('Ws')
// const _ = use('lodash')

class ChatController {
  constructor ({ socket, request, auth }) {
    this.socket = socket
    this.user = auth.user
    this.onReady()
  }

  async onReady () {
    const user = this.user
    user.online = true
    await user.save()
  }

  async onMessage (message) {
    // const channel = Ws.channel('/chat')
    // channel.inRoom(message.conversation_id).emit('message', message)
  }

  async onTyping (conversationId) {
    const channel = Ws.channel('/chat')
    const conversation = await Conversation.find(conversationId)
    if (!conversation) {
      throw new ValidateErrorException('Target not found')
    }
    const sendData = {
      user: this.user.toJSON(),
      conversation_id: conversationId
    }
    for (let userId of conversation.user_ids) {
      const chatSockets = channel.presence.get(String(userId))
      if (chatSockets && chatSockets.length) {
        for (let chatSocket of chatSockets) {
          chatSocket.socket.toMe().emit('typing', sendData)
        }
      }
    }
  }

  async onSeen (conversationId) {
    const channel = Ws.channel('/chat')
    const conversation = await Conversation.find(conversationId)
    const user = this.user.toJSON()
    console.log(user)
    if (!conversation) {
      throw new ValidateErrorException('Target not found')
    }
    if (String(conversation.lastMessage.user_id) !== String(user._id)) {
      await conversation.messages().where({ status: { ne: 'seen' } }).update({ status: 'seen' })
      conversation.lastMessage.status = 'seen'
      await conversation.save()
      for (let userId of conversation.user_ids) {
        const chatSockets = channel.presence.get(String(userId))
        if (chatSockets && chatSockets.length) {
          for (let chatSocket of chatSockets) {
            chatSocket.socket.toMe().emit('seen', conversation._id)
          }
        }
      }
      // publicChannel.inRoom(conversation._id).emit('seen', conversation._id)
    }
  }

  onClose () {
    // same as: socket.on('close')
  }

  onError () {
    // same as: socket.on('error')
  }

  async onDisconnect () {
    const user = this.user
    user.online = false
    await user.save()
  }
}

module.exports = ChatController
