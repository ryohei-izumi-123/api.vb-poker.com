'use strict'
// @ts-check

const config = require('config')
const AssetsController = require('../controllers/asset')
const Controller = new AssetsController()

/**
 *
 * @returns {IRouteParams}
 */
module.exports = {
  get: {
    method: 'get',
    path: `/${config.endpoint.private}/assets/schema/i18n/:filename`,
    middlewares: [],
    controller: Controller.get.bind(Controller)
  }
}
