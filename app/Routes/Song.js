'use strict'

/*
|--------------------------------------------------------------------------
| Song Routers
|--------------------------------------------------------------------------
|
*/

const Route = use('Route')

Route.group('song', () => {
  /**
   * @swagger
   * /songs:
   *   get:
   *     tags:
   *       - Song
   *     summary: Get songs
   *     parameters:
   *       - $ref: '#/parameters/ListQuery'
   *     responses:
   *       200:
   *         description: songs
   *         schema:
   *           type: array
   *           items:
   *               $ref: '#/definitions/Song'
   */
  Route.get('/', 'Api/SongsController.index')
    .middleware((['auth:jwt']))

  /**
   * @swagger
   * /songs:
   *   post:
   *     tags:
   *       - Song
   *     summary: Create song
   *     parameters:
   *       - name: body
   *         description: JSON of song
   *         in:  body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/NewSong'
   *     responses:
   *       201:
   *         description: song
   *         schema:
   *           $ref: '#/definitions/Song'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   *       422:
   *         $ref: '#/responses/ValidateFailed'
   */
  Route.post('/', 'Api/SongsController.store')
    .middleware((['auth:jwt']))
    .validator('StoreSong')

  /**
   * @swagger
   * /songs:
   *   put:
   *     tags:
   *       - Song
   *     summary: Update song
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *       - name: body
   *         description: JSON of song
   *         in:  body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/NewSong'
   *     responses:
   *       201:
   *         description: song
   *         schema:
   *           $ref: '#/definitions/Song'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   *       422:
   *         $ref: '#/responses/ValidateFailed'
   */
  Route.post('/', 'Api/SongsController.update')
    .middleware(['auth:jwt'])
    .instance('App/Models/Song')
    .validator('UpdateSong')

  /**
   * @swagger
   * /songs/{id}:
   *   delete:
   *     tags:
   *       - Song
   *     summary: Delete songs
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
  Route.delete('/:id', 'Api/SongsController.destroy')
    .middleware(['auth:jwt'])
    .instance('App/Models/Song')
}).prefix('/api/songs')
