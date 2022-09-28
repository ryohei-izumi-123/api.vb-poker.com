'use strict'
// @ts-check

const config = require('config')
const Authenticate = require('@fizz.js/node-authenticate/libs')
const Context = require('@fizz.js/node-context/libs')
const AuthController = require('../controllers/auth')
const Controller = new AuthController()

/**
 *
 * @returns {IRouteParams}
 */
module.exports = {
  auth: {
    method: 'post',
    path: `/${config.endpoint.private}/auth`,
    middlewares: [Context.validatePrivateScope.bind(Context), Controller.validationMiddleware('login')],
    controller: Controller.login.bind(Controller)
  },
  info: {
    method: 'get',
    path: `/${config.endpoint.private}/auth`,
    middlewares: [
      Context.validatePrivateScope.bind(Context),
      Authenticate.authenticate.bind(Authenticate),
      Controller.validationMiddleware('fetch')
    ],
    controller: Controller.fetch.bind(Controller)
  },
  logout: {
    method: 'delete',
    path: `/${config.endpoint.private}/auth`,
    middlewares: [
      Context.validatePrivateScope.bind(Context),
      Authenticate.authenticate.bind(Authenticate),
      Controller.validationMiddleware('logout')
    ],
    controller: Controller.logout.bind(Controller)
  },
  totp: {
    method: 'post',
    path: `/${config.endpoint.private}/auth/totp`,
    middlewares: [Context.validatePrivateScope.bind(Context), Controller.validationMiddleware('totp')],
    controller: Controller.totp.bind(Controller)
  },
  security: {
    method: 'patch',
    path: `/${config.endpoint.private}/auth/security`,
    middlewares: [
      Context.validateAnyScope.bind(Context),
      Authenticate.authenticate.bind(Authenticate),
      Controller.validationMiddleware('security')
    ],
    controller: Controller.security.bind(Controller)
  },
  update: {
    method: 'patch',
    path: `/${config.endpoint.private}/auth`,
    middlewares: [
      Context.validateAnyScope.bind(Context),
      Authenticate.authenticate.bind(Authenticate),
      Controller.validationMiddleware('update')
    ],
    controller: Controller.update.bind(Controller)
  },
  qr: {
    method: 'patch',
    path: `/${config.endpoint.private}/auth/qr`,
    middlewares: [
      Context.validateAnyScope.bind(Context),
      Authenticate.authenticate.bind(Authenticate),
      Controller.validationMiddleware('qr')
    ],
    controller: Controller.qr.bind(Controller)
  }
}
