'use strict'

/*
|--------------------------------------------------------------------------
| Album Routers
|--------------------------------------------------------------------------
|
*/

const Route = use('Route')

Route.group('album', () => {
  /**
   * @swagger
   * /albums:
   *   get:
   *     tags:
   *       - Album
   *     summary: Get albums
   *     parameters:
   *       - $ref: '#/parameters/ListQuery'
   *     responses:
   *       200:
   *         description: albums
   *         schema:
   *           type: array
   *           items:
   *               $ref: '#/definitions/Album'
   */
  Route.get('/', 'Api/AlbumsController.index')
    .middleware((['auth:jwt']))

  /**
   * @swagger
   * /albums:
   *   post:
   *     tags:
   *       - Album
   *     summary: Create album
   *     parameters:
   *       - name: body
   *         description: JSON of album
   *         in:  body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/NewAlbum'
   *     responses:
   *       201:
   *         description: album
   *         schema:
   *           $ref: '#/definitions/Album'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   *       422:
   *         $ref: '#/responses/ValidateFailed'
   */
  Route.post('/', 'Api/AlbumsController.store')
    .middleware((['auth:jwt']))
    .validator('StoreAlbum')

  /**
   * @swagger
   * /albums:
   *   put:
   *     tags:
   *       - Album
   *     summary: Update album
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *       - name: body
   *         description: JSON of album
   *         in:  body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/NewAlbum'
   *     responses:
   *       201:
   *         description: album
   *         schema:
   *           $ref: '#/definitions/Album'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   *       422:
   *         $ref: '#/responses/ValidateFailed'
   */
  Route.post('/', 'Api/AlbumsController.update')
    .middleware(['auth:jwt'])
    .instance('App/Models/Album')
    .validator('UpdateAlbum')

  /**
   * @swagger
   * /albums/{id}:
   *   delete:
   *     tags:
   *       - Album
   *     summary: Delete albums
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
  Route.delete('/:id', 'Api/AlbumsController.destroy')
    .middleware(['auth:jwt'])
    .instance('App/Models/Album')

  /**
   * @swagger
   * /albums/{id}/image:
   *   post:
   *     tags:
   *       - Album
   *     summary: Upload image to a album
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
  Route.post('/:id/image', 'Api/AlbumsController.uploadImage')
    .middleware(['auth:jwt'])
    .instance('App/Models/Album')

  /**
   * @swagger
   * /albums/{id}/like:
   *   post:
   *     tags:
   *       - Album
   *     summary: Like/Unlike a album
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
  Route.post('/:id/like', 'Api/AlbumsController.like')
    .middleware(['auth:jwt'])
    .instance('App/Models/Album')
}).prefix('/api/albums')
