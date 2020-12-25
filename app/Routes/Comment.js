'use strict'

/*
|--------------------------------------------------------------------------
| Comment Routers
|--------------------------------------------------------------------------
|
*/

const Route = use('Route')

Route.group('comment', () => {
  /**
   * @swagger
   * /comments/{id}:
   *   delete:
   *     tags:
   *       - Comment
   *     summary: Delete comments
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
  Route.delete('/:id', 'Api/CommentsController.destroy')
    .middleware(['auth:jwt'])
    .instance('App/Models/Comment')

  /**
   * @swagger
   * /comments/{id}/like:
   *   post:
   *     tags:
   *       - Comment
   *     summary: Like/Unlike a comment
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
  Route.post('/:id/like', 'Api/CommentsController.like')
    .middleware(['auth:jwt'])
    .instance('App/Models/Comment')

  /**
   * @swagger
   * /comments/{id}/comments:
   *   get:
   *     tags:
   *       - Comment
   *     summary: Get comments comment
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
  Route.get('/:id/comments', 'Api/CommentsController.getComments')
    .middleware(['auth:jwt'])
    .instance('App/Models/Comment')

  /**
   * @swagger
   * /comments/{id}/comments:
   *   post:
   *     tags:
   *       - Comment
   *     summary: Add comment to the comment
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *       - name: body
   *         description: JSON of comment
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
  Route.post('/:id/comments', 'Api/CommentsController.addComment')
    .middleware(['auth:jwt'])
    .instance('App/Models/Comment')
}).prefix('/api/comments')
