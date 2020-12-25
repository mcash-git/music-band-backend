'use strict'
const BaseController = use('App/Controllers/Http/Api/BaseController')
const Comment = use('App/Models/Comment')
// const Validator = use('Validator')
const UnAuthorizeException = use('App/Exceptions/UnAuthorizeException')
// const Config = use('Config')
const _ = require('lodash')
const ObjectID = require('mongodb').ObjectID
/**
 *
 * @class CommentsController
 */
class CommentsController extends BaseController {
  /**
   * Destroy
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf CommentsController
   *
   */
  async destroy ({ request, response, instance, auth }) {
    const comment = instance
    if (String(auth.user._id) !== String(comment.user_id)) {
      throw UnAuthorizeException.invoke()
    }
    await comment.comments().delete()
    await comment.delete()
    return response.apiDeleted()
  }

  /**
   * Like/Unlike a comment
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf CommentsController
   *
   */
  async like ({ request, response, instance, auth }) {
    const comment = instance
    const user = auth.user
    const isLike = request.input('like')
    let like = await comment.likes().where({user_id: user._id}).first()
    if (isLike) {
      if (!like) {
        await comment.likes().create({ user_id: user._id })
        comment.like_count = (comment.like_count || 0) + 1
        await comment.save()
      }
    } else {
      if (like) {
        await like.delete()
        comment.like_count = (comment.like_count || 0) - 1
        await comment.save()
      }
    }
    await comment.load('likes')
    return response.apiItem(comment)
  }

  /**
   * Add comment to a comment
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf CommentsController
   *
   */
  async addComment ({ request, response, instance, auth }) {
    const comment = instance
    const user = auth.user
    await this.validate(request.all(), { text: 'required|max:1000' })
    const subComment = await comment.comments().create({
      user_id: user._id,
      text: request.input('text')
    })
    comment.comment_count = (comment.like_count || 0) + 1
    await comment.save()
    return response.apiCreated(subComment)
  }

  /**
   * Get comment of comment
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf CommentsController
   *
   */
  async getComments ({ request, response, instance, decodeQuery }) {
    const comment = instance
    const comments = await comment.comments().query(decodeQuery()).fetch()
    return response.apiCollection(comments)
  }
}

module.exports = CommentsController
