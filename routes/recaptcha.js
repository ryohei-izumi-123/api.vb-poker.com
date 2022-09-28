'use strict'
// @ts-check

const config = require('config')
const Context = require('@fizz.js/node-context/libs')
const RecaptchaController = require('../controllers/recaptcha')
const Controller = new RecaptchaController()

/**
 *
 * @returns {IRouteParams}
 */
module.exports = {
  verify: {
    method: 'post',
    path: `/${config.endpoint.private}/recaptcha`,
    middlewares: [Context.validateAnyScope.bind(Context), Controller.validationMiddleware('verify')],
    controller: Controller.verify.bind(Controller)
  }
}
