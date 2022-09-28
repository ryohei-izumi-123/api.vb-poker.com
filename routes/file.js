'use strict'
// @ts-check

const config = require('config')
const Authenticate = require('@fizz.js/node-authenticate/libs')
const Context = require('@fizz.js/node-context/libs')
const FilesController = require('../controllers/file')
const Controller = new FilesController()

/**
 *
 * @returns {IRouteParams}
 */
module.exports = {
  create: {
    method: 'post',
    path: `/${config.endpoint.private}/files`,
    middlewares: [
      Context.validateAnyScope.bind(Context),
      Authenticate.authenticate.bind(Authenticate),
      Controller.validationMiddleware('create')
    ],
    controller: Controller.create.bind(Controller)
  }
}
