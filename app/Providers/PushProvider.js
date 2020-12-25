'use strict'

const { ServiceProvider } = require('@adonisjs/fold')
const _ = require('lodash')
const PushNotifications = require('node-pushnotifications')
const { LogicalException } = require('@adonisjs/generic-exceptions')

class SocialAuthProvider extends ServiceProvider {
  register () {
    this.app.bind('Adonis/Provider/Push', function () {
      const Config = use('Config')
      const settings = Config.get('push')
      const PushToken = use('App/Models/PushToken')
      const push = new PushNotifications(settings)
      const removeBadTokens = async (responses) => {
        for (let response of responses) {
          for (let message of response.message) {
            if (message.error) {
              await PushToken.where('deviceToken', message.regId).update({ status: PushToken.STATUS_DISABLED })
            }
          }
        }
      }

      return {
        send: async (userIds, message) => {
          if (!message || !_.isObject(message)) {
            throw new LogicalException('"message" argument mus be an object')
          }
          message = _.extend({
            // title: 'Music Bands',
            icon: 'ic_launcher',
            sound: 'ping.aiff',
            body: 'This is a notification from Revler App',
            badge: 1,
            custom: {
              message: message.body,
              key: message.key
            },
            topic: settings.topic
          }, message)
          userIds = _.isArray(userIds) ? userIds : [userIds]
          const tokens = await PushToken.where({
            user_id: { $in: userIds },
            status: PushToken.STATUS_ENABLED
          }).fetch()

          if (tokens.size()) {
            const response = await push.send(_.map(tokens.rows, 'device_token'), message)
            removeBadTokens(response)
          }
        }
      }
    })
  }
}

module.exports = SocialAuthProvider
