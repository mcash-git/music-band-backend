'use strict'

/*
|--------------------------------------------------------------------------
| User Routers
|--------------------------------------------------------------------------
|
*/

const Route = use('Route')

Route.group('user', () => {
  /**
   * @swagger
   * /users:
   *   get:
   *     tags:
   *       - User
   *     summary: Get users
   *     parameters:
   *       - $ref: '#/parameters/ListQuery'
   *     responses:
   *       200:
   *         description: users
   *         schema:
   *           type: array
   *           items:
   *               $ref: '#/definitions/User'
   */
  Route.get('/', 'Api/UsersController.index')

  /**
   * @swagger
   * /users/search:
   *   get:
   *     tags:
   *       - User
   *     summary: Get users
   *     parameters:
   *       - $ref: '#/parameters/ListQuery'
   *     responses:
   *       200:
   *         description: users
   *         schema:
   *           type: array
   *           items:
   *               $ref: '#/definitions/User'
   */
  Route.get('/search', 'Api/UsersController.search')

  /**
   * @swagger
   * /users/suggested:
   *   get:
   *     tags:
   *       - User
   *     summary: Get users
   *     parameters:
   *       - $ref: '#/parameters/ListQuery'
   *     responses:
   *       200:
   *         description: users
   *         schema:
   *           type: array
   *           items:
   *               $ref: '#/definitions/User'
   */
  Route.get('/suggested', 'Api/UsersController.suggested')

  /**
   * \@swagger
   * /users:
   *   post:
   *     tags:
   *       - User
   *     summary: Create user
   *     parameters:
   *       - name: body
   *         description: JSON of user
   *         in:  body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/NewUser'
   *     responses:
   *       200:
   *         description: user
   *         schema:
   *           $ref: '#/definitions/User'
   */
  // Route.post('/', 'Api/UsersController.store')

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     tags:
   *       - User
   *     summary: Returns user
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *       - $ref: '#/parameters/SingleQuery'
   *     responses:
   *       200:
   *         description: user
   *         schema:
   *           $ref: '#/definitions/User'
   *       404:
   *         $ref: '#/responses/NotFound'
   */
  Route.get('/:id', 'Api/UsersController.show')
    .middleware(['auth:jwt'])
    .instance('App/Models/User')

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     tags:
   *       - User
   *     summary: Update users
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *       - name: user
   *         description: User object
   *         in:  body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/NewUser'
   *     responses:
   *       202:
   *         description: user
   *         schema:
   *           $ref: '#/definitions/User'
   *       404:
   *         $ref: '#/responses/NotFound'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   *       403:
   *         $ref: '#/responses/Forbidden'
   *       422:
   *         $ref: '#/responses/ValidateFailed'
   */
  Route.put('/:id', 'Api/UsersController.update')
    .middleware(['auth:jwt'])
    .instance('App/Models/User')
    .validator('UpdateUser')

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     tags:
   *       - User
   *     summary: Delete users
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *     responses:
   *       202:
   *         description: delete success
   *       404:
   *         $ref: '#/responses/NotFound'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   */
  Route.delete('/:id', 'Api/UsersController.destroy')
    .middleware(['auth:jwt'])
    .instance('App/Models/User')

  /**
   * @swagger
   * /users/{id}/upload:
   *   post:
   *     tags:
   *       - User
   *     summary: Upload images to user
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *       - name: image
   *         description: image files
   *         in:  formData
   *         required: true
   *         type: file
   *       - name: is_avatar
   *         description: is_avatar
   *         in:  formData
   *         required: false
   *         type: boolean
   *     responses:
   *       200:
   *         description: upload success
   *       404:
   *         $ref: '#/responses/NotFound'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   *       403:
   *         $ref: '#/responses/Forbidden'
   *       422:
   *         $ref: '#/responses/ValidateFailed'
   */
  Route.post('/:id/upload', 'Api/UsersController.upload')
    .middleware(['auth:jwt'])
    .instance('App/Models/User')

  /**
    * @\swagger
    * /users/{id}/images/{imageId}/setFeatured:
    *   put:
    *     tags:
    *       - User
    *     summary: set featured image
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
    // Route.put('/:id/images/:imageId/setFeatured', 'Api/UsersController.setFeatured')
    // .middleware(['auth:jwt'])
    // .instance('App/Models/User')

  /**
   * @swagger
   * /users/{id}/images/{imageId}:
   *   delete:
   *     tags:
   *       - User
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
   *         description: delete success
   *       404:
   *         $ref: '#/responses/NotFound'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   *       403:
   *         $ref: '#/responses/Forbidden'
   */
  Route.delete('/:id/images/:imageId', 'Api/UsersController.deleteImage')
    .middleware(['auth:jwt'])
    .instance('App/Models/User')

  /**
   * @swagger
   * /users/{id}/images:
   *   get:
   *     tags:
   *       - User
   *     summary: Get images of user
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *     responses:
   *       200:
   *         description: success
   *         schema:
   *           type: array
   *           items:
   *           $ref: '#/definitions/Image'
   *       404:
   *         $ref: '#/responses/NotFound'
   */
  Route.get('/:id/images', 'Api/UsersController.images')
    .middleware(['auth:jwt'])
    .instance('App/Models/User')

  /**
   * @swagger
   * /users/{id}/instruments:
   *   get:
   *     tags:
   *       - User
   *     summary: Get instruments of user
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *     responses:
   *       200:
   *         description: success
   *         schema:
   *           type: array
   *           items:
   *           $ref: '#/definitions/Instrument'
   *       404:
   *         $ref: '#/responses/NotFound'
   */
  Route.get('/:id/instruments', 'Api/UsersController.instruments')
    .middleware(['auth:jwt'])
    .instance('App/Models/User')

  /**
   * @swagger
   * /users/{id}/posts:
   *   get:
   *     tags:
   *       - User
   *     summary: Get posts of user
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *     responses:
   *       200:
   *         description: success
   *         schema:
   *           type: array
   *           items:
   *           $ref: '#/definitions/Post'
   *       404:
   *         $ref: '#/responses/NotFound'
   */
  Route.get('/:id/posts', 'Api/UsersController.posts')
    .middleware(['auth:jwt'])
    .instance('App/Models/User')

  /**
   * @swagger
   * /users/{id}/bands:
   *   get:
   *     tags:
   *       - User
   *     summary: Get bands of user
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *     responses:
   *       200:
   *         description: success
   *         schema:
   *           type: array
   *           items:
   *           $ref: '#/definitions/Band'
   *       404:
   *         $ref: '#/responses/NotFound'
   */
  Route.get('/:id/bands', 'Api/UsersController.bands')
    .middleware(['auth:jwt'])
    .instance('App/Models/User')

  /**
   * @swagger
   * /users/{id}/follow:
   *   post:
   *     tags:
   *       - User
   *     summary: Follow an user
   *     responses:
   *       200:
   *         description: upload success
   *       404:
   *         $ref: '#/responses/NotFound'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   */
  Route.post('/:id/follow', 'Api/UsersController.follow')
    .middleware(['auth:jwt'])
    .instance('App/Models/User')
}).prefix('/api/users')
