'use strict'
// @ts-check

const config = require('config')
const Context = require('@fizz.js/node-context/libs')
const CountriesController = require('../controllers/country')
const Controller = new CountriesController()

/**
 *
 * @returns {IRouteParams}
 */
module.exports = {
  list: {
    method: 'get',
    path: `/${config.endpoint.private}/countries`,
    middlewares: [
      Context.validateAnyScope.bind(Context),
      Controller.validationMiddleware('getAll'),
    ],
    controller: Controller.getAll.bind(Controller),
  },
  getOne: {
    method: 'get',
    path: `/${config.endpoint.private}/countries/:id(\\d+)`,
    middlewares: [
      Context.validateAnyScope.bind(Context),
      Controller.validationMiddleware('getOne'),
    ],
    controller: Controller.getOne.bind(Controller),
  },
}
