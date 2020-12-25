'use strict'

/*
|--------------------------------------------------------------------------
| Post Routers
|--------------------------------------------------------------------------
|
*/

const Route = use('Route')

Route.group('post', () => {
  /**
   * @swagger
   * /posts:
   *   get:
   *     tags:
   *       - Post
   *     summary: Get posts
   *     parameters:
   *       - name: query
   *         description: query object
   *         in:  query
   *         schema:
   *           $ref: '#/parameters/ListQuery'
   *     responses:
   *       200:
   *         description: posts
   *         schema:
   *           type: array
   *           items:
   *               $ref: '#/definitions/Post'
   */
  Route.get('/', 'Api/PostsController.index')
    .middleware((['auth:jwt']))

  /**
   * @swagger
   * /posts:
   *   post:
   *     tags:
   *       - Post
   *     summary: Create post
   *     parameters:
   *       - name: body
   *         description: JSON of post
   *         in:  body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/NewPost'
   *     responses:
   *       201:
   *         description: post
   *         schema:
   *           $ref: '#/definitions/Post'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   *       422:
   *         $ref: '#/responses/ValidateFailed'
   */
  Route.post('/', 'Api/PostsController.store')
    .middleware((['auth:jwt']))
    .validator('StorePost')

  /**
   * @swagger
   * /posts:
   *   put:
   *     tags:
   *       - Post
   *     summary: Update post
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *       - name: body
   *         description: JSON of post
   *         in:  body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/NewPost'
   *     responses:
   *       201:
   *         description: post
   *         schema:
   *           $ref: '#/definitions/Post'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   *       422:
   *         $ref: '#/responses/ValidateFailed'
   */
  Route.post('/', 'Api/PostsController.update')
    .middleware(['auth:jwt'])
    .instance('App/Models/Post')
    .validator('UpdatePost')

  /**
   * @swagger
   * /posts/{id}:
   *   delete:
   *     tags:
   *       - Post
   *     summary: Delete posts
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
  Route.delete('/:id', 'Api/PostsController.destroy')
    .middleware(['auth:jwt'])
    .instance('App/Models/Post')

  /**
   * @swagger
   * /posts/{id}/images:
   *   post:
   *     tags:
   *       - Post
   *     summary: Upload images to a post
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
  Route.post('/:id/images', 'Api/PostsController.uploadImage')
    .middleware(['auth:jwt'])
    .instance('App/Models/Post')

  /**
   * @swagger
   * /posts/{id}/songs:
   *   post:
   *     tags:
   *       - Post
   *     summary: Upload song to a post
   *     consumes:
   *       - multipart/form-data
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *       - name: image
   *         description: image file
   *         in:  formData
   *         required: false
   *         type: file
   *       - name: song
   *         description: song file
   *         in:  formData
   *         required: true
   *         type: file
   *       - name: name
   *         description: name
   *         in:  formData
   *         required: true
   *         type: string
   *       - name: type
   *         description: type
   *         in:  formData
   *         required: true
   *         type: string
   *       - name: album_id
   *         description: album_id
   *         in:  formData
   *         required: false
   *         type: string
   *       - name: genres
   *         description: genres
   *         in:  formData
   *         required: false
   *         type: array
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
  Route.post('/:id/songs', 'Api/PostsController.uploadSong')
    .middleware(['auth:jwt'])
    .instance('App/Models/Post')

  /**
   * @swagger
   * /posts/{id}/view:
   *   post:
   *     tags:
   *       - Post
   *     summary: View a post
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
  Route.post('/:id/view', 'Api/PostsController.view')
    .middleware(['auth:jwt'])
    .instance('App/Models/Post')

  /**
   * @swagger
   * /posts/{id}/like:
   *   post:
   *     tags:
   *       - Post
   *     summary: Like/Unlike a post
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
  Route.post('/:id/like', 'Api/PostsController.like')
    .middleware(['auth:jwt'])
    .instance('App/Models/Post')

  /**
   * @swagger
   * /posts/{id}/comments:
   *   get:
   *     tags:
   *       - Post
   *     summary: Get comments post
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
  Route.get('/:id/comments', 'Api/PostsController.getComments')
    .middleware(['auth:jwt'])
    .instance('App/Models/Post')

  /**
   * @swagger
   * /posts/{id}/comments:
   *   post:
   *     tags:
   *       - Post
   *     summary: Add comment to the post
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *       - name: body
   *         description: JSON of post
   *         in:  body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/NewComment'
   *     responses:
   *       202:
   *         description: comment success
   *       404:
   *         $ref: '#/responses/NotFound'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   */
  Route.post('/:id/comments', 'Api/PostsController.addComment')
    .middleware(['auth:jwt'])
    .instance('App/Models/Post')
}).prefix('/api/posts')
