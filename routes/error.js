'use strict'
// @ts-check

const config = require('config')
const Context = require('@fizz.js/node-context/libs')
const ErrorController = require('../controllers/error')
const Controller = new ErrorController()

/**
 *
 * @returns {IRouteParams}
 */
module.exports = {
  auth: {
    method: 'post',
    path: `/${config.endpoint.private}/errors`,
    middlewares: [Context.validateAnyScope.bind(Context), Controller.validationMiddleware('error')],
    controller: Controller.error.bind(Controller)
  }
}
