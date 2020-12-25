'use strict'

/*
|--------------------------------------------------------------------------
| Conversation Routers
|--------------------------------------------------------------------------
|
*/

const Route = use('Route')

/**
 * @swagger
 * /users/{id}/conversations:
 *   get:
 *     tags:
 *       - Conversation
 *     summary: Retrieve list conversations
 *     parameters:
 *       - $ref: '#/parameters/Id'
 *       - $ref: '#/parameters/ListQuery'
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           $ref: '#/definitions/Conversation'
 */
Route.get('/api/users/:id/conversations', 'Api/ConversationsController.index')
  .middleware(['auth'])
  .instance('App/Models/User')

/**
 * @swagger
 * /conversations:
 *   post:
 *     tags:
 *       - Conversation
 *     summary: User open a conversation with another user
 *     parameters:
 *       - name: target
 *         description: user_id or band_id
 *         in:  formData
 *         required: true
 *         type: string
 *       - name: type
 *         description: Type of conversation
 *         in:  formData
 *         required: true
 *         type: string
 *         enum:
 *           - private
 *           - room
 *     responses:
 *       200:
 *         description: conversation
 *         schema:
 *           $ref: '#/definitions/Conversation'
 */
Route.post('/api/conversations', 'Api/ConversationsController.open')
  .middleware(['auth'])

/**
 * @swagger
 * /conversations/{id}/read:
 *   post:
 *     tags:
 *       - Conversation
 *     summary: Read conversation
 *     parameters:
 *       - $ref: '#/parameters/Id'
 *     responses:
 *       200:
 *         description: conversation
 *         schema:
 *           $ref: '#/definitions/Conversation'
 */
Route.post('/api/conversations/:id/read', 'Api/ConversationsController.read')
  .middleware(['auth'])
  .instance('App/Models/Conversation')

/**
 * @swagger
 * /conversations/{id}/messages:
 *   get:
 *     tags:
 *       - Conversation
 *     summary: Retrieve list messages
 *     parameters:
 *       - $ref: '#/parameters/Id'
 *       - $ref: '#/parameters/ListQuery'
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Message'
 */
Route.get('/api/conversations/:id/messages', 'Api/ConversationsController.messages')
  .middleware(['auth'])
  .instance('App/Models/Conversation')

/**
 * @swagger
 * /conversations/{id}/users:
 *   get:
 *     tags:
 *       - Conversation
 *     summary: Retrieve list users
 *     parameters:
 *       - $ref: '#/parameters/Id'
 *       - $ref: '#/parameters/ListQuery'
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/User'
 */
Route.get('/api/conversations/:id/users', 'Api/ConversationsController.users')
  .middleware(['auth'])
  .instance('App/Models/Conversation')

/**
   * @swagger
   * /conversations/{id}/upload:
   *   post:
   *     tags:
   *       - Conversation
   *     summary: Upload images to conversation
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *       - name: image
   *         description: image files
   *         in:  formData
   *         required: true
   *         type: file
   *     responses:
   *       200:
   *         description: upload success
   */
Route.post('/api/conversations/:id/upload', 'Api/ConversationsController.upload')
  .middleware(['auth'])
  .instance('App/Models/Conversation')

/**
  * @swagger
  * /conversations/{id}/images/{imageId}:
  *   delete:
  *     tags:
  *       - Conversation
  *     summary: Delete an image
  *     parameters:
  *       - $ref: '#/parameters/Id'
  *       - name: imageId
  *         description: Id of Image object
  *         in:  path
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: update success
  */
Route.delete('/api/conversations/:id/images/:imageId', 'Api/ConversationsController.deleteImage')
  .middleware(['auth'])
  .instance('App/Models/Conversation')

/**
 * @swagger
 * /conversations/{id}/images:
 *   get:
 *     tags:
 *       - Conversation
 *     summary: Retrieve images of conversation
 *     parameters:
 *       - $ref: '#/parameters/Id'
 *       - $ref: '#/parameters/ListQuery'
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Image'
 */
Route.get('/api/conversations/:id/images', 'Api/ConversationsController.images')
  .middleware(['auth'])
  .instance('App/Models/Conversation')

/**
 * @swagger
 * /conversations/{type}/{target}:
 *   get:
 *     tags:
 *       - Conversation
 *     summary: Retrieve list conversations
 *     parameters:
*       - name: target
 *         description: user_id or band_id
 *         in:  path
 *         required: true
 *         type: string
 *       - name: type
 *         description: Type of conversation
 *         in:  path
 *         required: true
 *         type: string
 *         enum:
 *           - private
 *           - room
 *     responses:
 *       200:
 *         description: success
 *         schema:
 *           $ref: '#/definitions/Conversation'
 */
Route.get('/api/conversations/:type/:target', 'Api/ConversationsController.show')
  .middleware(['auth'])
