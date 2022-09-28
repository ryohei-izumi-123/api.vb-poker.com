'use strict'
// @ts-check

const config = require('config')
const Context = require('@fizz.js/node-context/libs')
const OptionsController = require('../controllers/option')
const Controller = new OptionsController()

/**
 *
 * @returns {IRouteParams}
 */
module.exports = {
  list: {
    method: 'get',
    path: `/${config.endpoint.private}/options`,
    middlewares: [Context.validateAnyScope.bind(Context), Controller.validationMiddleware('getAll')],
    controller: Controller.getAll.bind(Controller)
  }
}
