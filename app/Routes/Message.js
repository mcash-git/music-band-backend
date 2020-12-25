'use strict'

/*
|--------------------------------------------------------------------------
| Message Routers
|--------------------------------------------------------------------------
|
*/

const Route = use('Route')

/**
 * @swagger
 * /messages:
 *   post:
 *     tags:
 *       - Message
 *     summary: Send message
 *     parameters:
 *       - name: body
 *         description: JSON of message
 *         in:  body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/NewMessage'
 *     responses:
 *       200:
 *         description: message
 *         schema:
 *           $ref: '#/definitions/Message'
 */
Route.post('/api/messages', 'Api/MessagesController.send').middleware(['auth'])

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     tags:
 *       - Message
 *     summary: Delete a message
 *     parameters:
 *       - $ref: '#/parameters/Id'
 *     responses:
 *       202:
 *         description: delete success
 */
Route.delete('/api/messages/:id', 'Api/MessagesController.destroy')
  .middleware(['auth'])
  .instance('App/Models/Message')
