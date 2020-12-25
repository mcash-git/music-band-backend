'use strict'
const BaseController = use('App/Controllers/Http/Api/BaseController')
const Article = use('App/Models/Article')
// const Validator = use('Validator')
// const UnAuthorizeException = use('App/Exceptions/UnAuthorizeException')
// const Config = use('Config')
/**
 *
 * @class ArticlesController
 */
class ArticlesController extends BaseController {
  /**
   * Store
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf ArticlesController
   *
   */
  async store ({ request, response, auth }) {
    // await this.validate(request.all(), Article.rules)
    const user = auth.user
    const article = await user.articles().create(request.only(['title', 'body']))
    return response.apiCreated(article)
  }

  /**
   * Update
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf ArticlesController
   *
   */
  async update ({ request, response, auth, instance }) {
    // await this.validate(request.all(), Article.rules)
    const article = instance
    article.merge(request.only(['title', 'body']))
    await article.save()
    return response.apiUpdated(article)
  }

  /**
   * Destroy
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf ArticlesController
   *
   */
  async destroy ({ request, response, auth, instance }) {
    // await this.validate(request.all(), Article.rules)
    const article = instance
    article.is_active = false
    await article.save()
    return response.apiUpdated(article)
  }

  /**
   * Upload
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
   */
  async upload ({ request, response, instance, auth }) {
    const article = instance
    const image = request.file('image', {
      types: ['image'],
      size: '2mb'
    })
    const prefix = use('uuid').v1().replace(/-/g, '')
    const fileName = `${prefix}_${image.clientName}`
    const uploadPath = use('Helpers').publicPath('uploads')
    await image.move(uploadPath, { name: fileName })
    const filePath = `uploads/${fileName}`
    await article.images().create({ fileName, filePath })
    await article.load('images')
    if (request.input('is_thumb')) {
      article.thumb = filePath
      await article.save()
    }
    return response.apiUpdated(article)
  }
}

module.exports = ArticlesController
