'use strict'

/*
|--------------------------------------------------------------------------
| Band Routers
|--------------------------------------------------------------------------
|
*/

const Route = use('Route')

Route.group('band', () => {
  /**
   * @swagger
   * /bands:
   *   get:
   *     tags:
   *       - Band
   *     summary: Get bands
   *     parameters:
   *       - name: query
   *         description: query object
   *         in:  query
   *         schema:
   *           $ref: '#/parameters/ListQuery'
   *     responses:
   *       200:
   *         description: bands
   *         schema:
   *           type: array
   *           items:
   *               $ref: '#/definitions/Band'
   */
  Route.get('/', 'Api/BandsController.index')
    .middleware((['auth:jwt']))

  /**
   * @swagger
   * /bands:
   *   post:
   *     tags:
   *       - Band
   *     summary: Create band
   *     parameters:
   *       - name: body
   *         description: JSON of band
   *         in:  body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/NewBand'
   *     responses:
   *       201:
   *         description: band
   *         schema:
   *           $ref: '#/definitions/Band'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   *       422:
   *         $ref: '#/responses/ValidateFailed'
   */
  Route.post('/', 'Api/BandsController.store')
    .middleware((['auth:jwt']))
    .validator('StoreBand')

  /**
   * @swagger
   * /bands:
   *   put:
   *     tags:
   *       - Band
   *     summary: Update band
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *       - name: body
   *         description: JSON of band
   *         in:  body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/NewBand'
   *     responses:
   *       201:
   *         description: band
   *         schema:
   *           $ref: '#/definitions/Band'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   *       422:
   *         $ref: '#/responses/ValidateFailed'
   */
  Route.post('/', 'Api/BandsController.update')
    .middleware(['auth:jwt'])
    .instance('App/Models/Band')
    .validator('UpdateBand')

  /**
   * @swagger
   * /bands/{id}:
   *   delete:
   *     tags:
   *       - Band
   *     summary: Delete bands
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
  Route.delete('/:id', 'Api/BandsController.destroy')
    .middleware(['auth:jwt'])
    .instance('App/Models/Band')

  /**
   * @swagger
   * /bands/{id}/image:
   *   post:
   *     tags:
   *       - Band
   *     summary: Upload image to a band
   *     consumes:
   *       - multipart/form-data
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *       - name: image
   *         description: image files
   *         in:  formData
   *         required: true
   *         type: file
   *       - name: caption
   *         description: caption
   *         in:  formData
   *         required: false
   *         type: string
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
  Route.post('/:id/image', 'Api/BandsController.uploadImage')
    .middleware(['auth:jwt'])
    .instance('App/Models/Band')

  /**
   * @swagger
   * /bands/{id}/like:
   *   post:
   *     tags:
   *       - Band
   *     summary: Like/Unlike a band
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *     responses:
   *       202:
   *         description: like success
   *       404:
   *         $ref: '#/responses/NotFound'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   */
  Route.post('/:id/like', 'Api/BandsController.like')
    .middleware(['auth:jwt'])
    .instance('App/Models/Band')

  /**
   * @swagger
   * /bands/{id}/users:
   *   post:
   *     tags:
   *       - Band
   *     summary: Invite user to the band
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *     responses:
   *       202:
   *         description: invite success
   *       404:
   *         $ref: '#/responses/NotFound'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   */
  Route.post('/:id/users', 'Api/BandsController.addUser')
    .middleware(['auth:jwt'])
    .instance('App/Models/Band')

  /**
   * @swagger
   * /bands/{id}/users/join:
   *   post:
   *     tags:
   *       - Band
   *     summary: Join a band by invited
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *     responses:
   *       202:
   *         description: join success
   *       404:
   *         $ref: '#/responses/NotFound'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   */
  Route.post('/:id/users/join', 'Api/BandsController.join')
    .middleware(['auth:jwt'])
    .instance('App/Models/Band')

  /**
   * @swagger
   * /bands/{id}/users:
   *   get:
   *     tags:
   *       - Band
   *     summary: get users of the band
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *     responses:
   *       202:
   *         description: get success
   *       404:
   *         $ref: '#/responses/NotFound'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   */
  Route.get('/:id/users', 'Api/BandsController.users')
    .middleware(['auth:jwt'])
    .instance('App/Models/Band')

  /**
   * @swagger
   * /bands/{id}/songs:
   *   get:
   *     tags:
   *       - Band
   *     summary: get songs of the band
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *     responses:
   *       202:
   *         description: get success
   *       404:
   *         $ref: '#/responses/NotFound'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   */
  Route.get('/:id/songs', 'Api/BandsController.songs')
    .middleware(['auth:jwt'])
    .instance('App/Models/Band')

  /**
   * @swagger
   * /bands/{id}/follow:
   *   post:
   *     tags:
   *       - User
   *     summary: Follow an band
   *     responses:
   *       200:
   *         description: upload success
   *       404:
   *         $ref: '#/responses/NotFound'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   */
  Route.post('/:id/follow', 'Api/BandsController.follow')
    .middleware(['auth:jwt'])
    .instance('App/Models/Band')
}).prefix('/api/bands')
