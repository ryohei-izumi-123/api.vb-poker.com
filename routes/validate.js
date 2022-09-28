'use strict'
// @ts-check

const config = require('config')
const Authenticate = require('@fizz.js/node-authenticate/libs')
const Context = require('@fizz.js/node-context/libs')
const ValidateController = require('../controllers/validate')
const Controller = new ValidateController()


/**
 *
 * @returns {IRouteParams}
 */
module.exports = {
  unique: {
    method: 'post',
    path: `/${config.endpoint.private}/validate/unique`,
    middlewares: [
      Context.validateAnyScope.bind(Context),
      Authenticate.authenticate.bind(Authenticate),
      Controller.validationMiddleware('unique'),
    ],
    controller: Controller.unique.bind(Controller),
  },
  password: {
    method: 'post',
    path: `/${config.endpoint.private}/validate/password`,
    middlewares: [
      Context.validateAnyScope.bind(Context),
      Authenticate.authenticate.bind(Authenticate),
      Controller.validationMiddleware('password'),
    ],
    controller: Controller.password.bind(Controller),
  },
}
