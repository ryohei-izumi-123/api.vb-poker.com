'use strict'
// @ts-check

const config = require('config')
// const Authenticate = require('@fizz.js/node-authenticate/libs')
// const Context = require('@fizz.js/node-context/libs')
const TestController = require('../controllers/test')
const Controller = new TestController()

/**
 *
 * @returns {IRouteParams}
 */
module.exports = {
  test: {
    method: 'get',
    path: `/${config.endpoint.private}/tests`,
    middlewares: [
      // Context.validatePrivateScope.bind(Context),
      // Authenticate.authenticate.bind(Authenticate),
      Controller.validationMiddleware('test'),
    ],
    controller: Controller.test.bind(Controller)
  },
  encode: {
    method: 'get',
    path: `/${config.endpoint.public}/tests/0/openssl/encode`,
    middlewares: [
      // Context.validatePrivateScope.bind(Context),
      // Authenticate.authenticate.bind(Authenticate),
      Controller.validationMiddleware('encodeSecret'),
    ],
    controller: Controller.encodeSecret.bind(Controller)
  },
  decode: {
    method: 'get',
    path: `/${config.endpoint.public}/tests/0/openssl/decode`,
    middlewares: [
      // Context.validatePrivateScope.bind(Context),
      // Authenticate.authenticate.bind(Authenticate),
      Controller.validationMiddleware('decodeSecret'),
    ],
    controller: Controller.decodeSecret.bind(Controller)
  },
  model: {
    method: 'get',
    path: `/${config.endpoint.private}/model`,
    middlewares: [
      // Context.validatePrivateScope.bind(Context),
      // Authenticate.authenticate.bind(Authenticate),
      Controller.validationMiddleware('model'),
    ],
    controller: Controller.model.bind(Controller)
  },
}