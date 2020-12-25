'use strict'

/*
|--------------------------------------------------------------------------
| Instrument Routers
|--------------------------------------------------------------------------
|
*/

const Route = use('Route')

Route.group('instrument', () => {
  /**
   * @swagger
   * /instruments:
   *   get:
   *     tags:
   *       - Instrument
   *     summary: Get instruments
   *     parameters:
   *       - $ref: '#/parameters/ListQuery'
   *     responses:
   *       200:
   *         description: instruments
   *         schema:
   *           type: array
   *           items:
   *               $ref: '#/definitions/Instrument'
   */
  Route.get('/', 'Api/InstrumentsController.index')
  // .middleware((['auth:jwt']))

  /**
   * @swagger
   * /instruments:
   *   post:
   *     tags:
   *       - Instrument
   *     summary: Create instrument
   *     parameters:
   *       - name: body
   *         description: JSON of instrument
   *         in:  body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/NewInstrument'
   *     responses:
   *       201:
   *         description: instrument
   *         schema:
   *           $ref: '#/definitions/Instrument'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   *       422:
   *         $ref: '#/responses/ValidateFailed'
   */
  Route.post('/', 'Api/InstrumentsController.store')
    .middleware((['auth:jwt']))
    .validator('StoreInstrument')

  /**
   * @swagger
   * /instruments:
   *   put:
   *     tags:
   *       - Instrument
   *     summary: Update instrument
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *       - name: body
   *         description: JSON of instrument
   *         in:  body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/NewInstrument'
   *     responses:
   *       201:
   *         description: instrument
   *         schema:
   *           $ref: '#/definitions/Instrument'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   *       422:
   *         $ref: '#/responses/ValidateFailed'
   */
  Route.post('/', 'Api/InstrumentsController.update')
    .middleware(['auth:jwt'])
    .instance('App/Models/Instrument')
    .validator('UpdateInstrument')

  /**
   * @swagger
   * /instruments/{id}:
   *   delete:
   *     tags:
   *       - Instrument
   *     summary: Delete instruments
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
  Route.delete('/:id', 'Api/InstrumentsController.destroy')
    .middleware(['auth:jwt'])
    .instance('App/Models/Instrument')
}).prefix('/api/instruments')
