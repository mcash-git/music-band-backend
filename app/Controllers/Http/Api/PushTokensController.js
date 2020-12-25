'use strict'

const BaseController = use('App/Controllers/Http/Api/BaseController')
const PushToken = use('App/Models/PushToken')
// const Exceptions = use('Exceptions')

/**
 *
 * @class PushTokensController
 */
class PushTokensController extends BaseController {
  /**
   * store
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf PushTokensController
   */
  async store ({ request, response, auth }) {
    await this.validate(request.all(), PushToken.rules)
    let pushToken = await PushToken.where({ device_token: request.input('device_token') }).first()
    if (!pushToken) {
      pushToken = new PushToken(request.only(['device_token', 'device_type']))
    }
    pushToken.user_id = auth.user._id
    pushToken.badge = 0
    pushToken.status = PushToken.STATUS_ENABLED
    await pushToken.save()
    response.apiCreated(pushToken)
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
  async destroy ({ request, response, auth }) {
    await this.validate(request.all(), {device_token: 'required'})
    await auth.user.pushTokens().where({ device_token: request.input('device_token') }).delete()
    return response.apiDeleted()
  }
}

module.exports = PushTokensController
