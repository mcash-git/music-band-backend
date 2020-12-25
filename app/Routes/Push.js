'use strict'

/*
|--------------------------------------------------------------------------
| Push Routers
|--------------------------------------------------------------------------
|
*/
const Route = use('Route')

Route.group('push', () => {
  /**
   * @swagger
   * /pushTokens:
   *   post:
   *     tags:
   *       - PushToken
   *     summary: Create push token
   *     parameters:
   *       - name: body
   *         description: JSON of pushToken
   *         in:  body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/NewPushToken'
   *     responses:
   *       201:
   *         description: push token
   *         schema:
   *           $ref: '#/definitions/PushToken'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   *       422:
   *         $ref: '#/responses/ValidateFailed'
   */
  Route.post('/', 'Api/PushTokensController.store')
    .middleware((['auth:jwt']))

  /**
   * @swagger
   * /pushTokens:
   *   delete:
   *     tags:
   *       - PushToken
   *     summary: Delete pushToken
   *     parameters:
   *       - name: device_token
   *         description: device_token.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       202:
   *         description: delete success
   *       404:
   *         $ref: '#/responses/NotFound'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   */
  Route.delete('/', 'Api/PushTokensController.destroy')
    .middleware(['auth:jwt'])
}).prefix('/api/pushTokens')
