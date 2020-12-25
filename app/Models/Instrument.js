'use strict'

const Model = use('Model')

/**
 * @swagger
 * definitions:
 *   NewInstrument:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       note:
 *         type: string
 *   Instrument:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 */
class Instrument extends Model {
  // timestamp
  static get createTimestamp () { return 'createdAt' }
  static get updateTimestamp () { return 'updatedAt' }

  images () {
    return this.morphMany('App/Models/Image', 'imageable_type', 'imageable_id')
  }
}

module.exports = Instrument
