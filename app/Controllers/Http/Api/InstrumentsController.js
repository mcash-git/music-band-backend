'use strict'
const BaseController = use('App/Controllers/Http/Api/BaseController')
const Instrument = use('App/Models/Instrument')
// const Validator = use('Validator')
// const UnAuthorizeException = use('App/Exceptions/UnAuthorizeException')
// const Config = use('Config')
// const moment = require('moment')
// const _ = require('lodash')
/**
 *
 * @class InstrumentController
 */
class InstrumentController extends BaseController {
  /**
   * Index
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf InstrumentController
   *
   */
  async index ({ request, response, decodeQuery, instance }) {
    const instruments = await Instrument.query(decodeQuery()).fetch()
    return response.apiCollection(instruments)
  }
}

module.exports = InstrumentController
