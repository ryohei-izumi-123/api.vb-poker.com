'use strict'
// @ts-check

const config = require('config')
const Authenticate = require('@fizz.js/node-authenticate/libs')
const Acl = require('@fizz.js/node-acl-v3/libs')
const Context = require('@fizz.js/node-context/libs')
const LanguagesController = require('../controllers/language')
const Controller = new LanguagesController()

/**
 *
 * @returns {IRouteParams}
 */
module.exports = {
  list: {
    method: 'get',
    path: `/${config.endpoint.private}/languages`,
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
    path: `/${config.endpoint.private}/languages/:id(\\d+)`,
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
    path: `/${config.endpoint.private}/languages`,
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
    path: `/${config.endpoint.private}/languages/:id(\\d+)`,
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
    path: `/${config.endpoint.private}/languages/:id(\\d+)`,
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
    path: `/${config.endpoint.private}/languages/:id(\\d+)/status`,
    middlewares: [
      Context.validateAnyScope.bind(Context),
      Authenticate.authenticate.bind(Authenticate),
      Acl.canAccess.bind(Acl),
      Controller.validationMiddleware('status')
    ],
    controller: Controller.status.bind(Controller)
  },
  i18n: {
    method: 'get',
    path: '/:scope/languages/:locale',
    middlewares: [Context.validateAnyScope.bind(Context), Controller.validationMiddleware('i18n')],
    controller: Controller.i18n.bind(Controller)
  }
}
