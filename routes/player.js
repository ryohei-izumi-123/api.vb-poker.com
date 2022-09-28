'use strict'
// @ts-check

const config = require('config')
const Authenticate = require('@fizz.js/node-authenticate/libs')
const Acl = require('@fizz.js/node-acl-v3/libs')
const Context = require('@fizz.js/node-context/libs')
const PlayersController = require('../controllers/player')
const Controller = new PlayersController()

/**
 *
 * @returns {IRouteParams}
 */
module.exports = {
  list: {
    method: 'get',
    path: `/${config.endpoint.private}/players`,
    middlewares: [
      Context.validateAnyScope.bind(Context),
      Authenticate.authenticate.bind(Authenticate),
      Acl.canAccess.bind(Acl),
      Controller.validationMiddleware('getAll')
    ],
    controller: Controller.getAll.bind(Controller)
  },
  getOne: {
    method: 'get',
    path: `/${config.endpoint.private}/players/:id(\\d+)`,
    middlewares: [
      Context.validateAnyScope.bind(Context),
      Authenticate.authenticate.bind(Authenticate),
      Acl.canAccess.bind(Acl),
      Controller.validationMiddleware('getOne')
    ],
    controller: Controller.getOne.bind(Controller)
  },
  create: {
    method: 'post',
    path: `/${config.endpoint.private}/players`,
    middlewares: [
      Context.validateAnyScope.bind(Context),
      Authenticate.authenticate.bind(Authenticate),
      Acl.canAccess.bind(Acl),
      Controller.validationMiddleware('create')
    ],
    controller: Controller.create.bind(Controller)
  },
  update: {
    method: 'patch',
    path: `/${config.endpoint.private}/players/:id(\\d+)`,
    middlewares: [
      Context.validateAnyScope.bind(Context),
      Authenticate.authenticate.bind(Authenticate),
      Acl.canAccess.bind(Acl),
      Controller.validationMiddleware('update')
    ],
    controller: Controller.update.bind(Controller)
  },
  delete: {
    method: 'delete',
    path: `/${config.endpoint.private}/players/:id(\\d+)`,
    middlewares: [
      Context.validateAnyScope.bind(Context),
      Authenticate.authenticate.bind(Authenticate),
      Acl.canAccess.bind(Acl),
      Controller.validationMiddleware('destroy')
    ],
    controller: Controller.destroy.bind(Controller)
  },
  status: {
    method: 'patch',
    path: `/${config.endpoint.private}/players/:id(\\d+)/status`,
    middlewares: [
      Context.validateAnyScope.bind(Context),
      Authenticate.authenticate.bind(Authenticate),
      Acl.canAccess.bind(Acl),
      Controller.validationMiddleware('status')
    ],
    controller: Controller.status.bind(Controller)
  },
  register: {
    method: 'post',
    path: `/${config.endpoint.private}/players/auth`,
    middlewares: [
      Context.validateAnyScope.bind(Context),
      // Acl.canAccess.bind(Acl),
      Controller.validationMiddleware('auth')
    ],
    controller: Controller.auth.bind(Controller)
  },
  info: {
    method: 'get',
    path: `/${config.endpoint.private}/players/auth`,
    middlewares: [
      Context.validateAnyScope.bind(Context),
      Authenticate.authenticate.bind(Authenticate),
      // Acl.canAccess.bind(Acl),
      Controller.validationMiddleware('getPlayerAuth')
    ],
    controller: Controller.getPlayerAuth.bind(Controller)
  },
  logout: {
    method: 'delete',
    path: `/${config.endpoint.private}/players/auth`,
    middlewares: [
      Context.validateAnyScope.bind(Context),
      Authenticate.authenticate.bind(Authenticate),
      Controller.validationMiddleware('logoutPlayer')
    ],
    controller: Controller.logoutPlayer.bind(Controller)
  }
}
